import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/week-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('object', { week: new Date(2015, 9, 21) });
    this.set('propertyName', 'week');
  });

  test('It renders a week input', async function(assert) {
    await render(hbs`{{form-fields/week-field propertyName object=object}}`);
    assert.dom('input[type="week"]').exists({ count: 1 }, 'Input is rendered');
  });

  test('It accepts a date value', async function(assert) {
    await render(hbs`{{form-fields/week-field propertyName object=object}}`);
    assert.dom('input').hasValue('2015-W43', 'Week value is set');
  });

  test('Updating a week input', async function(assert) {
    await render(hbs`{{form-fields/week-field propertyName object=object}}`);
    await fillIn('input', '2015-W44');
    assert.ok(this.get('object.week') instanceof Date);
    assert.equal(+this.get('object.week'), +(new Date(2015, 9, 26)));
  });
});
