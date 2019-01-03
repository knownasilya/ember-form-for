import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import layout from '../../templates/components/form-fields/radio-field-simple';

import { humanize } from '../../utils/strings';

const RadioFieldComponent = Component.extend({
  tagName: '',
  layout,

  control: 'one-way-radio',

  i18n: service(),
  config: service('ember-form-for/config'),

  modelName: or('object.modelName', 'object.constructor.modelName'),

  update(object, propertyName, value) {
    set(object, propertyName, value);
  },

  labelText: computed('value', 'label', function() {
    let i18n = get(this, 'i18n');
    let label = get(this, 'label');

    if (isPresent(label)) {
      return label;
    } else if (isPresent(i18n)) {
      return i18n.t(get(this, 'labelI18nKey'));
    } else {
      return get(this, 'label') || humanize(get(this, 'value'));
    }
  }),

  labelI18nKey: computed('config.i18nKeyPrefix', 'modelName', 'propertyName', 'value', function() {
    let value = get(this, 'value');

    if (isPresent(value)) {
      value = dasherize(value.toString());
    }

    return [
      get(this, 'config.i18nKeyPrefix'),
      dasherize(get(this, 'modelName') || ''),
      dasherize(get(this, 'propertyName') || ''),
      value
    ].filter((x) => !!x)
     .join('.');
  })
});

RadioFieldComponent.reopenClass({
  positionalParams: ['propertyName', 'value']
});

export default RadioFieldComponent;