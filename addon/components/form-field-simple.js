import Ember from 'ember';
import layout from '../templates/components/form-field-simple';

import { humanize } from '../utils/strings';

const {
  Component,
  String: { dasherize },
  assert,
  computed,
  computed: { notEmpty, or, reads },
  get,
  getWithDefault,
  guidFor,
  inject: { service },
  isEmpty,
  isPresent,
  mixin,
  observer,
  set
} = Ember;

const FormFieldComponent = Component.extend({
  layout,

  i18n: service(),
  config: service('ember-form-for/config'),

  classNameBindings: [],

  concatenatedProperties: [
    'inputClasses',
    'labelClasses'
  ],
  configClasses: [
    'inputClasses',
    'labelClasses'
  ],

  control: 'one-way-input',

  init() {
    this._super(...arguments);

    let configClasses = get(this, 'configClasses');
    let fieldClasses = get(this, 'config.fieldClasses');
    let classNames = this.classNames.compact();
    let classNameBindings = this.classNameBindings.compact();

    this.classNames = classNames.concat(fieldClasses);
    this.classNameBindings = classNameBindings.slice();

    configClasses.forEach((type) => {
      let result = get(this, `config.${type}`);
      let values = get(this, type) || [];

      if (result) {
        set(this, type, values.concat(result));
      } else {
        set(this, type, values);
      }
    });

    this.propertyNameDidChange();
  },

  didReceiveAttrs() {
    this._super(...arguments);

    assert('{{form-field}} requires an object property to be passed in',
           get(this, 'object') != null);

    assert('{{form-field}} requires the propertyName property to be set',
           typeof get(this, 'propertyName') === 'string');

    set(this, 'modelName', this.getModelName());
  },

  propertyNameDidChange: observer('propertyName', function() {
    let propertyName = get(this, 'propertyName');

    mixin(this, {
      rawValue: reads(`object.${propertyName}`)
    });
  }),

  update(object, propertyName, value) {
    set(object, propertyName, value);
  },

  labelText: computed('propertyName', 'label', function() {
    let i18n = get(this, 'i18n');
    let label = get(this, 'label');

    if (isPresent(label)) {
      return label;
    } else if (isPresent(i18n)) {
      return i18n.t(get(this, 'labelI18nKey'));
    } else {
      return humanize(get(this, 'propertyName'));
    }
  }),

  labelI18nKey: computed('config.i18nKeyPrefix', 'modelName', 'propertyName', function() {
    return [
      get(this, 'config.i18nKeyPrefix'),
      dasherize(get(this, 'modelName') || ''),
      dasherize(get(this, 'propertyName') || '')
    ].filter((x) => !!x)
     .join('.');
  }),

  fieldId: computed('object', 'form', 'propertyName', function() {
    let baseId = get(this, 'form') || get(this, 'elementId');
    return `${baseId}_${get(this, 'propertyName')}`;
  }),

  fieldName: computed('object', 'modelName', 'propertyName', function() {
    return `${this._nameForObject()}[${get(this, 'propertyName')}]`;
  }),

  _nameForObject() {
    return get(this, 'modelName') || guidFor(get(this, 'object'));
  },

  getModelName() {
    let formName = get(this, 'form');
    let modelName = get(this, 'object.modelName');
    let constructorName = get(this, 'object.constructor.modelName');
    let changesetConstructorName = get(this, 'object._content.constructor.modelName');

    return formName || modelName || constructorName || changesetConstructorName;
  },

  value: computed('rawValue', function() {
    let serializeValue = getWithDefault(this, 'serializeValue', (value) => value);
    return serializeValue(get(this, 'rawValue'));
  }),

  actions: {
    processUpdate(object, propertyName, value) {
      let rawValue = get(this, 'rawValue');
      let deserializeValue = getWithDefault(this, 'deserializeValue', (value) => value);
      get(this, 'update')(object, propertyName, deserializeValue(value, rawValue));
    }
  }
});

FormFieldComponent.reopenClass({
  positionalParams: ['propertyName']
});

export default FormFieldComponent;
