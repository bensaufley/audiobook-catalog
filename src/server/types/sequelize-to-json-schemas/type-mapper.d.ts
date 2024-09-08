declare module '@alt3/sequelize-to-json-schemas/lib/type-mapper' {
  export = TypeMapper;
  /**
   * Class responsible for converting Sequelize DataTypes to strategy-compatible `type` properties.
   *
   * @copyright Copyright (c) 2019 ALT3 B.V.
   * @license Licensed under the MIT License
   */
  declare class TypeMapper {
    /**
     * Replaces current `schema.type` with the object returned by the strategy as
     * the solution for nullable types can vary strongly between them.
     *
     * @private
     * @param {string} type Name of the type (e.g. 'string')
     * @param {StrategyInterface} strategy Strategy instance
     * @returns {object}
     */
    private static _getNullableType;

    /**
     * Returns the strategy-specific `type` property for the given Sequelize DataType
     *
     * @see {@link https://sequelize.org/master/manual/data-types.html}
     * @param {string} attributeName Name of the Sequelize attribute
     * @param {object} properties Properties of the Sequelize attribute
     * @param {StrategyInterface} strategy Strategy instance
     * @returns {object} Object holding the `type` property
     * @throws {TypeError} Throws an exception if the resolved DataType is unkown to the Mapper
     */
    map(attributeName: string, properties: object, strategy: StrategyInterface): object;
  }
}
