declare module '@alt3/sequelize-to-json-schemas' {
  import JsonSchemaManager = require('@alt3/sequelize-to-json-schemas/lib/schema-manager');
  import JsonSchema7Strategy from '@alt3/sequelize-to-json-schemas/lib/strategies/json-schema-v7';
  import OpenApi3Strategy from '@alt3/sequelize-to-json-schemas/lib/strategies/openapi-v3';

  export { JsonSchema7Strategy, JsonSchemaManager, OpenApi3Strategy };
}
