import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/month-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('object', { month: new Date(2015, 9) });
    this.set('propertyName', 'month');
  });

  test('It renders a month input', async function(assert) {
    await render(hbs`{{form-fields/month-field propertyName object=object}}`);
    assert.dom('input[type="month"]').exists({ count: 1 }, 'Input is rendered');
  });

  test('It accepts a date value', async function(assert) {
    await render(hbs`{{form-fields/month-field propertyName object=object}}`);
    assert.dom('input').hasValue('2015-10', 'Month value is set');
  });

  test('Updating a month input', async function(assert) {
    await render(hbs`{{form-fields/month-field propertyName object=object}}`);
    await fillIn('input', '2015-11');
    assert.ok(this.get('object.month') instanceof Date);
    assert.equal(+this.get('object.month'), +(new Date('2015-11')));
  });
});
