import { JsonSchemaManager, OpenApi3Strategy } from '@alt3/sequelize-to-json-schemas';

import models from '~db/models/index.js';

const schemaManager = new JsonSchemaManager();

const deepUpdateRef = <T>(schema: T, ref: string): T => {
  if (typeof schema !== 'object' || schema === null) return schema;

  if (Array.isArray(schema)) return schema.map((v) => deepUpdateRef(v, ref)) as T;

  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      if (key === '$ref') return [key, `${ref}${value}`];
      if (typeof value === 'object') return [key, deepUpdateRef(value, ref)];
      return [key, value];
    }),
  ) as T;
};

const mods: { [k in keyof typeof models]?: Parameters<typeof schemaManager.generate>[2] } = {
  Audiobook: {
    exclude: ['deletedAt', 'filepath'],
  },
};

const strategy = new OpenApi3Strategy();

const modelSchemas = Object.fromEntries(
  Object.entries(models).map(([name, model]) => [
    name,
    deepUpdateRef(
      schemaManager.generate(model, strategy, mods[name as keyof typeof models] ?? {}),
      'audiobook-catalog',
    ),
  ]),
);

export default modelSchemas;
