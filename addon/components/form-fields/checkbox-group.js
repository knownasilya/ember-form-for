import Component from '@ember/component';
import { get } from '@ember/object';
import layout from '../../templates/components/form-fields/checkbox-group';

const CheckboxGroupComponent = Component.extend({
  tagName: '',
  layout,

  actions: {
    updateSelection(value, object, propertyName, include) {
      let selection = get(object, propertyName);
      if (include && !selection.includes(value)) {
        selection.pushObject(value);
      } else {
        selection.removeObject(value);
      }

      if (this.get('update') !== undefined) {
        this.get('update')(object, propertyName, selection);
      }
    }
  }
});

CheckboxGroupComponent.reopenClass({
  positionalParams: ['propertyName']
});

export default CheckboxGroupComponent;
