declare module '@alt3/sequelize-to-json-schemas/lib/schema-manager' {
  import type sequelize from 'sequelize';

  export = SchemaManager;
  /**
   * Class responsible for generating the various schemas.
   *
   * @copyright Copyright (c) 2019 ALT3 B.V.
   * @license Licensed under the MIT License
   */
  declare class SchemaManager {
    /**
     * Returns the model file name (e.g. `user.json`).
     *
     * @private
     * @returns {string}
     */
    private static _getModelFileName;

    /**
     * Checks if the given attribute property is required
     *
     * @private
     * @param {object} attributeProperties The raw sequelize attribute properties
     * @returns {boolean} True if attribute is required
     */
    private static _isRequiredProperty;

    /**
     * Return the custom Sequelize attribute property as configured in `jsonSchema`.
     *
     * @private
     * @param {string} propertyName Name of the custom attribute property to search for
     * @param {object} attributeProperties Raw Sequelize attribute properties
     * @returns {*} Null if the custom attribute does not exist
     */
    private static _getCustomPropertyValue;

    /**
     * @param {object} options User options.
     * @param {string} options.baseUri Base URI prefixed to generated paths, defaults to '/'
     * @param {boolean} options.absolutePaths False to generate relative paths, defaults to true
     * @param {string} options.secureSchemaUri False to render a HTTP link to the strategy-specific schema, defaults to true (HTTPS)
     * @param {string} options.disableComments True to render attribute property 'comment', defaults to false
     */
    constructor(options?: {
      baseUri?: string;
      absolutePaths?: boolean;
      secureSchemaUri?: string;
      disableComments?: string;
    });

    /**
     * Generate json schema for the provided model, using any of the available strategies.
     *
     * @param {sequelize.ModelStatic} model Instance of Sequelize.Model
     * @param {strategyInterface} strategy Strategy instance
     * @param {object} options User options.
     * @param {string} options.title Name to be used as model property 'title'
     * @param {string} options.description Text to be used as model property 'description'
     * @param {array} options.exclude List of attribute names that will not be included in the generated schema
     * @param {array} options.include List of attribute names that will be included in the generated schema
     * @param {array} options.associations False to exclude all associations from the generated schema, defaults to true
     * @returns {object} Object contaiing the strategy-specific schema
     * @param {array} options.excludeAssociations List of association names that will not be included in the generated schema
     * @param {array} options.includeAssociations List of association names that will be included in the generated schema
     */
    generate(
      model: sequelize.ModelStatic,
      strategy: strategyInterface,
      options?: {
        title?: string;
        description?: string;
        exclude?: any[];
        include?: any[];
        associations?: any[];
      },
    ): object;

    /**
     * Ensures constructor options are valid.
     *
     * @private
     * @param {object} options Merged default and user provided options.
     * @returns {null}
     */
    private _verifyOptions;

    /**
     * Ensures model options are valid.
     *
     * @private
     * @param {object} options Merged default and user provided options.
     * @returns {null}
     */
    private _verifyModelOptions;

    /**
     * Ensures the passed Sequelize model is valid.
     *
     * @private
     * @param {sequelize.Model} model Instance of Sequelize.Model
     * @returns {null}
     */
    private _verifyModel;

    /**
     * Enusures the passed strategy is valid.
     *
     * @private
     * @param {strategyInterface} strategy Strategy instance
     * @returns {null}
     */
    private _verifyStrategy;

    /**
     * Returns the raw properties from a (v4 or v5+) Sequelize model.
     *
     * @private
     * @returns {object} Raw Sequelize attributes
     */
    private _getRawAttributes;

    /**
     * Returns the associations for a Sequelize model.
     *
     * @private
     * @returns {object|null} List of associated models or null
     */
    private _getAssociations;

    /**
     * Returns the strategy-specific schema structure for the model, ready for attribute insertion.
     *
     * @private
     * @see {@link https://json-schema.org/learn/getting-started-step-by-step.html#properties}
     * @returns {object} Schema structure
     */
    private _getModelContainer;

    /**
     * Returns the strategy-specific schema structure for the attribute.
     *
     * @private
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties The raw sequelize attribute properties
     * @returns {object} Schema structure
     */
    private _getAttributeContainer;

    /**
     * Returns the model path as used by $id and $ref.
     *
     * @private
     * @param {string} modelName Name of the model
     * @returns {string}
     */
    private _getModelFilePath;

    /**
     * Returns the `schema` property for the model.
     *
     * @private
     * @param {boolean} secureSchemaUri True for HTTPS, false for HTTP
     * @returns {object}
     */
    private _getPropertySchema;

    /**
     * Returns the `id` property for the model.
     *
     * @private
     * @param {string} Path to the json file
     * @returns {object}
     */
    private _getPropertyId;

    /**
     * Returns the `title` property for the model. Since this property
     * is supported by all schemas we do not need a strategy here.
     *
     * @private
     * @param {sequelize.Model} model Instance of Sequelize.Model
     * @returns {object}
     */
    private _getModelPropertyTitle;

    /**
     * Returns the `description` property for the model. Since this property
     * is supported by all schemas we do not need a strategy here.
     *
     * @private
     * @returns {object|null} Null if the user did not pass the option.
     */
    private _getModelPropertyDescription;

    /**
     * Returns a user-defined schema object that overrides the type object
     * created by the TypeMapper class.  This is necessary for any sequelize type
     * that is mapped to the ANY array while using the OpenAPI strategy.
     *
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties Raw sequelize attribute properties
     * @returns {object|null}
     */
    _getAttributePropertyTypeOverride(attributeName: string, attributeProperties: object): object | null;

    /**
     * Returns the attribute path as used by $id and $ref
     *
     * @private
     * @returns {string}
     */
    private _getAttributePath;

    /**
     * Returns the user-defined attribute description. Since this property
     * is supported by all schemas we do not need a strategy here.
     *
     * @private
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties Raw sequelize attribute properties
     * @returns {string}
     */
    private _getAttributePropertyDescription;

    /**
     * Returns the user-defined attribute comment.
     *
     * @private
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties Raw sequelize attribute properties
     * @returns {string}
     */
    private _getAttributePropertyComment;

    /**
     * Returns one of the user-defined attribute properties 'readOnly' or 'writeOnly'.
     *
     * @private
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties Raw sequelize attribute properties
     * @returns {object|null}
     */
    private _getPropertyReadOrWriteOnly;

    /**
     * Returns the user-defined attribute examples (strategy-specific)
     *
     * @private
     * @param {string} attributeName Name of the attribute
     * @param {object} attributeProperties Raw sequelize attribute properties
     * @returns {string}
     */
    private _getAttributeExamples;

    /**
     * Returns the property for the given association.
     *
     * @private
     * @param {string} association name
     * @param {Sequelize.Association} association Sequelize Association
     * @returns {object|null} Object if HasOne, BelongsTo or HasMany and not excluded, null otherwise
     */
    private _getModelPropertyForAssociation;
  }
}
