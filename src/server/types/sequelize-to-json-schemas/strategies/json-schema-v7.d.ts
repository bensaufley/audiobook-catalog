declare module '@alt3/sequelize-to-json-schemas/lib/strategies/json-schema-v7' {
  export = JsonSchema7Strategy;
  /**
   * Class responsible for converting Sequelize models into "JSON Schema Draft-07" schemas.
   *
   * @copyright Copyright (c) 2019 ALT3 B.V.
   * @license Licensed under the MIT License
   * @augments StrategyInterface
   */
  declare class JsonSchema7Strategy {
    /**
     * Returns the "$schema" property.
     *
     * @example
     * {
     *   '$schema': 'https://json-schema.org/draft-07/schema#'
     * }
     * @param {boolean} secureSchemaUri True for HTTPS, false for HTTP
     * @returns {object}
     */
    getPropertySchema(secureSchemaUri: boolean): object;
    /**
     * Returns the "$id" property.
     *
     * @example
     * {
     *   '$id': '/user.json'
     * }
     * @param {string} path
     * @returns {object}
     */
    getPropertyId(path: string): object;
    /**
     * Returns the "$comment" property (but only if manager option `disableComments` is false).
     *
     * @example
     * {
     *   '$comment': 'This comment must be a string'
     * }
     * @param {string} comment
     * @returns {object}
     */
    getPropertyComment(comment: string): object;
    /**
     * Returns the "examples" property.
     *
     * @example
     * {
     *   'examples': [
     *     'example 1',
     *     'example 2'
     *   ]
     * }
     * @param {array} examples List with one or multiple examples
     * @returns {object}
     */
    getPropertyExamples(examples: any[]): object;
    /**
     * Converts a `type` property so it allows null values.
     *
     * @example
     * {
     *   type: [
     *     'string',
     *      'null'
     *   ]
     * }
     *
     * @param {string} type Value of the `type` property
     * @returns {object}
     */
    convertTypePropertyToAllowNull(type: string): object;
    /**
     * Returns the `contentEncoding` property as used by Json Schema for base64 encoded strings (like BLOB).
     *
     * @example
     * {
     *   'contentEncoding': 'base64',
     * }
     *
     * @returns {object}
     */
    getPropertyForBase64Encoding(): object;
    /**
     * Returns the property pointing to a HasOne association.
     *
     * @example
     * {
     *   profile: {
     *     $ref: '#/definitions/profile'
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
     *     $ref: '#/definitions/company'
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
     *       $ref: '#/definitions/document'
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
     *           $ref: '#/definitions/user'
     *         },
     *         {
     *           type: 'object',
     *           properties: {
     *             friendship: {
     *               $ref: '#/definitions/friendship'
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
