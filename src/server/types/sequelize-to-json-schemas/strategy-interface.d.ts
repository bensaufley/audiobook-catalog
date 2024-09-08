declare module '@alt3/sequelize-to-json-schemas/lib/strategy-interface' {
  export = StrategyInterface;
  /**
   * Strategy interface where we define the methods every inheriting strategy MUST implement.
   *
   * @copyright Copyright (c) 2019 ALT3 B.V.
   * @license Licensed under the MIT License
   */
  declare class StrategyInterface {
    /**
     * Throws an error if the strategy has not impemented one of the required methods.
     *
     * @private
     * @param {string} strategyName Name of the strategy with missing method
     * @param {string} methodName Name of the missing method
     */
    private static _throwMissingImplementationError;

    /**
     * Must return the property used as "schema".
     *
     * @see {@link https://json-schema.org/understanding-json-schema/reference/schema.html#schema}
     * @param {boolean} secureSchemaUri True for HTTPS, false for HTTP
     * @returns {object|null} Null to omit property from the result
     */
    getPropertySchema(): object | null;

    /**
     * Must return the property used as "id".
     *
     * @see {@link https://json-schema.org/understanding-json-schema/structuring.html#the-id-property}
     * @param {string} path Path to the json file
     * @returns {object|null} Null to omit property from the result
     */
    getPropertyId(path: string): object | null;

    /**
     * Must return the property used as "comment".
     *
     * Please note that this comment is not intended to be exposed to users of the schema and therefore
     * will not be added to the schema unless manager option 'disableComments' is disabled.
     *
     * @see {@link https://json-schema.org/understanding-json-schema/reference/generic.html#comments}
     * @param {string} comment Value to use as the comment
     * @returns {object}
     */
    getPropertyComment(comment: string): object;

    /**
     * Must return the property used as "examples".
     * @param {array} examples List with one or multiple examples
     * @returns {object}
     */
    getPropertyExamples(examples: any[]): object;

    /**
     * Must return the strategy specific property used for base64 string encoding.
     *
     * @returns {object}
     */
    getPropertyForBase64Encoding(): object;

    /**
     * Must returns a new `type` object, enriched to allow null values.
     *
     * @param {string} type Name of the type as determined by the Typemapper (e.g. `string`)
     * @returns {object}
     */
    convertTypePropertyToAllowNull(type: string): object;

    /**
     * Must return the property pointing to a HasOne association.
     *
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object|null} Null to omit property from the result
     */
    getPropertyForHasOneAssociation(association: Sequelize.association): object | null;

    /**
     * Must return the property pointing to a HasMany association.
     *
     * @param {Sequelize.association} association Sequelize associaton object
     * @returns {object|null} Null to omit property from the result
     */
    getPropertyForHasManyAssociation(association: Sequelize.association): object | null;
  }
}
