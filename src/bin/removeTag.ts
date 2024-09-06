import minimist from 'minimist';
import { exit } from 'process';

import { ready } from '../db/models';
import AudiobookTag from '../db/models/AudiobookTag';
import Tag from '../db/models/Tag';

const opts = {
  help: ['h', 'boolean', 'Show this help', false],
  force: ['f', 'boolean', 'Force removal of tag if it is in use', false],
  debug: ['d', 'boolean', 'Enable debugging output', false],
} as const;

const optsEntries = (Object.entries(opts) as [keyof typeof opts, (typeof opts)[keyof typeof opts]][]).toSorted(
  ([a, [, , requiredA]], [b, [, , requiredB]]) => {
    if (requiredA === requiredB) return a.localeCompare(b, undefined, { caseFirst: 'false' });
    if (requiredA) return -1;
    return 1;
  },
);

const longestFlag = Math.max(...optsEntries.map(([key]) => key.length + 8));

const help = () => `Usage: ${process.argv[1]} [flags] [...TAGS]

  ${'TAGS:'.padEnd(longestFlag, ' ')} One or more tags to remove
${optsEntries
  .map(
    ([key, [short, , description, required]]) =>
      `  ${`${required ? '' : '['}-${short}|--${key}${required ? '' : ']'}:`.padEnd(longestFlag, ' ')} ${description}`,
  )
  .join('\n')}
`;

const args = minimist(process.argv.slice(2), {
  boolean: optsEntries.filter(([, [, type]]) => type === 'boolean').map(([key]) => key),
  alias: Object.fromEntries(optsEntries.map(([key, [short]]) => [key, short])),
  unknown: (arg) => {
    if (!arg.startsWith('-')) return true;

    console.error(`Unknown argument: ${arg}\n\n${help()}`);
    return exit(1);
  },
});

if (args.help) {
  console.log(help());
  exit(0);
}

const { _: tags, force } = args;

if (!tags.length) {
  console.error('At least one tag must be provided\n\n', help());
  exit(1);
}

if (args.debug) {
  console.debug('Arguments:', args);
}

await ready;

const responses = await Promise.allSettled(
  tags.map(async (tag) => {
    console.log(`Removing tag "${tag}"...`);
    const entry = await Tag.findOne({
      where: { name: tag },
      include: [Tag.associations.AudiobookTags!, Tag.associations.Audiobooks!],
      logging: !!args.debug,
    });
    if (!entry) {
      throw new Error(`Tag "${tag}" not found`);
    }
    if (entry.AudiobookTags?.length || entry.Audiobooks?.length) {
      if (force) {
        console.warn(`Tag "${tag}" is in use, removing anyway`);
        await AudiobookTag.destroy({ where: { TagId: entry.id }, logging: !!args.debug });
      } else {
        throw new Error(`Tag "${tag}" is in use`);
      }
    }
    await entry.destroy({ logging: !!args.debug });
    console.log(`Tag "${tag}" removed`);
  }),
);

const rejected = responses.map((r, i) => [tags[i], r] as const).filter(([, { status }]) => status === 'rejected') as [
  string,
  PromiseRejectedResult,
][];

if (rejected.length) {
  console.error(
    `Some tags could not be removed:\n\n${rejected.map(([tag, { reason }]) => `  ${tag}: ${reason instanceof Error ? reason.message : reason.toString()}`).join('\n')}\n\n${help()}`,
  );
  exit(1);
}
