import Component from '@ember/component';
import { set } from '@ember/object';
import layout from '../../templates/components/form-fields/checkbox-field';

const CheckboxFieldComponent = Component.extend({
  tagName: '',
  layout,

  control: 'one-way-checkbox',

  update(object, propertyName, value) {
    set(object, propertyName, value);
  }
});

CheckboxFieldComponent.reopenClass({
  positionalParams: ['propertyName']
});

export default CheckboxFieldComponent;
