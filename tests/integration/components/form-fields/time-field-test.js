import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/time-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('object', { time: new Date(2015, 9, 21, 16, 9) });
    this.set('propertyName', 'time');
  });

  test('It renders a time input', async function(assert) {
    await render(hbs`{{form-fields/time-field propertyName object=object}}`);
    assert.dom('input[type="time"]').exists({ count: 1 }, 'Input is rendered');
  });

  test('It accepts a date value', async function(assert) {
    await render(hbs`{{form-fields/time-field propertyName object=object}}`);
    assert.dom('input').hasValue('16:09', 'Time value is set');
  });

  test('Updating a time input', async function(assert) {
    this.set('object.time', new Date('2015-01-01T16:09'));
    await render(hbs`{{form-fields/time-field propertyName object=object}}`);
    await fillIn('input', '16:10');
    assert.ok(this.get('object.time') instanceof Date);
    assert.equal(+this.get('object.time'), +(new Date('2015-01-01T16:10')));
  });
});
