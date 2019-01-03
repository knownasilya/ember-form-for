import Component from '@ember/component';
import layout from '../templates/components/form-label';

const FormLabelComponent = Component.extend({
  tagName: 'label',
  layout,

  attributeBindings: [
    'for',
    'form'
  ]
});

FormLabelComponent.reopenClass({
  positionalParams: ['label']
});

export default FormLabelComponent;
