import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/date-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('object', { date: new Date(2015, 9, 21) });
    this.set('propertyName', 'date');
  });

  test('It renders a date input', async function(assert) {
    await render(hbs`{{form-fields/date-field propertyName object=object}}`);
    assert.dom('input[type="date"]').exists({ count: 1 }, 'Input is rendered');
  });

  test('It accepts a date value', async function(assert) {
    await render(hbs`{{form-fields/date-field propertyName object=object}}`);
    assert.dom('input').hasValue('2015-10-21', 'Date value is set');
  });

  test('Updating a date input', async function(assert) {
    await render(hbs`{{form-fields/date-field propertyName object=object}}`);
    await fillIn('input', '2015-10-22');
    assert.ok(this.get('object.date') instanceof Date);
    assert.equal(+this.get('object.date'), +(new Date('2015-10-22')));
  });

  test('Can remove from date input', async function(assert) {
    await render(hbs`{{form-fields/date-field propertyName object=object}}`);
    await fillIn('input', '');
    assert.equal(this.get('object.date'), null);
  });
});
