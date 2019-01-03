import Component from '@ember/component';
import { set } from '@ember/object';
import layout from '../../templates/components/form-fields/radio-group';

const RadioGroupComponent = Component.extend({
  tagName: '',
  layout,

  update() {
    set(...arguments);
  }
});

RadioGroupComponent.reopenClass({
  positionalParams: ['propertyName']
});

export default RadioGroupComponent;
