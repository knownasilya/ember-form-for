import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-label}}', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders', async function(assert) {
    await render(hbs`{{form-label}}`);
    assert.dom('label').exists({ count: 1 });
  });

  test('It shows the label value', async function(assert) {
    await render(hbs`{{form-label "Foo"}}`);
    assert.dom('label').hasText('Foo');
  });

  test('For can be bound', async function(assert) {
    await render(hbs`{{form-label for="abc"}}`);
    assert.dom('label').hasAttribute('for', 'abc');
  });

  test('Form can be bound', async function(assert) {
    await render(hbs`{{form-label form="form_1"}}`);
    assert.dom('label').hasAttribute('form', 'form_1');
  });

  test('Alternatively can yield to block', async function(assert) {
    await render(hbs`{{#form-label}}TESTING{{/form-label}}`);
    assert.dom('label').hasText('TESTING');
  });

  test('Required adds a * to the label', async function(assert) {
    await render(hbs`{{form-label "Test" required=true}}`);
    assert.equal(this.$('label:contains(*)').length, 1);
  });
});
