import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/datetime-local-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('object', { date: new Date(2015, 9, 21, 16, 9) });
    this.set('propertyName', 'date');
  });

  test('It renders a datetime-local input', async function(assert) {
    await render(hbs`{{form-fields/datetime-local-field propertyName object=object}}`);
    assert.dom('input[type="datetime-local"]').exists({ count: 1 }, 'Input is rendered');
  });

  test('It accepts a date value', async function(assert) {
    await render(hbs`{{form-fields/datetime-local-field propertyName object=object}}`);
    assert.dom('input').hasValue('2015-10-21T16:09', 'Date value is set');
  });

  test('Updating a datetime-local input', async function(assert) {
    await render(hbs`{{form-fields/datetime-local-field propertyName object=object}}`);
    await fillIn('input', '2015-10-22T16:10');
    assert.ok(this.get('object.date') instanceof Date);
    assert.equal(+this.get('object.date'), +(new Date(2015, 9, 22, 16, 10)));
  });
});
