import type { InferAttributes, Model } from 'sequelize';

interface InferAttributesOptions<Excluded> {
  omit?: Excluded;
}

export type InferJSONAttributes<M, Options extends InferAttributesOptions<keyof M | never | ''> = { omit: never }> =
  M extends Model<any, any>
    ? {
        [K in keyof InferAttributes<M, Options>]: M[K] extends Date ? string : M[K];
      }
    : never;
