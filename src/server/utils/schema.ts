import s, { type Object as AJVObject } from 'ajv-ts';

export const fourOhFour = (text = 'Not Found') => ({
  404: s
    .object({
      error: s.string(),
    })
    .required()
    .describe(text).schema,
});

export const bookIdParams = {
  params: s.object({ bookId: s.string().format('uuid') }).required().schema,
};

export const userHeader = {
  'x-audiobook-catalog-user': s.string().describe('User UUID').format('uuid'),
};

export const onlyUserHeader = (required = true) =>
  s.object(userHeader).requiredFor(...(required ? (['x-audiobook-catalog-user'] as const) : [])).schema;

export const withUserHeader = (
  schema: AJVObject | false | null,
  required = typeof schema === 'boolean' ? schema : true,
) =>
  s
    .object({
      ...(typeof schema === 'object' ? schema?.schema.properties : {}),
      ...userHeader,
    })
    .requiredFor(
      ...[
        ...((typeof schema === 'object' ? schema?.schema.required ?? [] : []) as any[]),
        ...(required ? ['x-audiobook-catalog-user'] : []),
      ],
    ).schema;
