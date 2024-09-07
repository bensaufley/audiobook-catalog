declare module '@alt3/sequelize-to-json-schemas/lib/strategies/openapi-v3' {
  export = OpenApi3Strategy;
  /**
   * Class responsible for converting Sequelize models into "OpenAPI 3.0" schemas.
   *
   * @copyright Copyright (c) 2019 ALT3 B.V.
   * @license Licensed under the MIT License
   * @augments StrategyInterface
   */
  declare class OpenApi3Strategy {
    /**
     * Returns null because OpenAPI 3.0 does not support the "schema" property.
     *
     * @param {boolean} secureSchemaUri True for HTTPS, false for HTTP
     * @returns {null}
     */
    getPropertySchema(): null;
    /**
     * Returns null because OpenAPI 3.0 does not support the "id" property.
     *
     * @example null
     * @param {string} path
     * @returns {null}
     */
    getPropertyId(path: string): null;
    /**
     * Returns null because OpenAPI 3.0 does not support the "comment" property.
     *
     * @example null
     * @param {string} comment
     * @returns {null}
     */
    getPropertyComment(comment: string): null;
    /**
     * Returns the "example" property.
     *
     * @example
     * {
     *   'example': [
     *     'example 1',
     *     'example 2'
     *   ]
     * }
     * @param {array} examples List with one or multiple examples
     * @returns {object}
     */
    getPropertyExamples(examples: any[]): object;
    /**
     * Returns the `format` property as used by OAS for base64 base64 encoded strings (like BLOB).
     *
     * @example
     * {
     *   'format': 'byte',
     * }
     *
     * @returns {object}
     */
    getPropertyForBase64Encoding(): object;
    /**
     * Returns a new `type` property, enriched to allow null values.
     *
     * @example
     * {
     *   'type': 'string',
     *   'nullable': 'true'
     * }
     *
     * @param {string|array} type Value of the `type` property
     * @returns {object}
     */
    convertTypePropertyToAllowNull(type: string | any[]): object;
    /**
     * Returns the property pointing to a HasOne association.
     *
     * @example
     * {
     *   profile: {
     *     $ref: '#/components/schemas/profile'
     *   }
     * }
     * @param {string} association name
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object} Null to omit property from the result
     */
    getPropertyForHasOneAssociation(associationName: any, association: string): object;
    /**
     * Returns the property pointing to a BelongsTo association.
     *
     * @example
     * {
     *   company: {
     *     $ref: '#/components/schemas/company'
     *   }
     * }
     * @param {string} association name
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object} Null to omit property from the result
     */
    getPropertyForBelongsToAssociation(associationName: any, association: string): object;
    /**
     * Returns the property pointing to a HasMany association.
     *
     * @example
     * {
     *   documents: {
     *     type: "array",
     *     items: {
     *       $ref: '#/components/schemas/document'
     *     }
     *   }
     * }
     * @param {string} association name
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object} Null to omit property from the result
     */
    getPropertyForHasManyAssociation(associationName: any, association: string): object;
    /**
     * Returns the property pointing to a BelongsToMany association.
     *
     * @example
     * {
     *   friends: {
     *     type: "array",
     *     items: {
     *       allOf: [
     *         {
     *           $ref: '#/components/schemas/user'
     *         },
     *         {
     *           type: 'object',
     *           properties: {
     *             friendship: {
     *               $ref: '#/components/schemas/friendship'
     *             }
     *           }
     *         }
     *       ]
     *     }
     *   }
     * }
     * @param {string} association name
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object} Null to omit property from the result
     */
    getPropertyForBelongsToManyAssociation(associationName: any, association: string): object;
  }
}
