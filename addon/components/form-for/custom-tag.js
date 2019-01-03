import Component from '@ember/component';
import layout from '../../templates/components/form-for/custom-tag';

export default Component.extend({
  layout,
  attributeBindings: ['id', 'role']
});
