import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../templates/components/form-hint';

export default Component.extend({
  tagName: '',
  layout,

  joinedHintClasses: computed('hintClasses', function() {
    return (get(this, 'hintClasses') || []).join(' ');
  })
});
