import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { set, get, computed } from '@ember/object';
import { typeOf } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import titlecase from '../utils/titlecase';

export default Mixin.create({
  instrumentDisplay: '{{form-field}}',

  didReceiveAttrs() {
    assert(`${this.instrumentDisplay} requires propertyName to be set`,
      typeOf(get(this, 'propertyName')) === 'string');

    let objectType = typeOf(get(this, 'object'));
    assert(`${this.instrumentDisplay} requires object to be set`,
      objectType === 'object' || objectType === 'instance');

    this._setupLabel();

    this._super(...arguments);
  },

  identifier: computed('object', 'propertyName', 'value', function() {
    return this._identifier();
  }),

  _identifier() {
    return `${guidFor(get(this, 'object'))}_${get(this, 'propertyName')}`;
  },

  _setupLabel() {
    set(this, 'label',
      get(this, 'label') || titlecase(get(this, 'propertyName')));
  }
});
