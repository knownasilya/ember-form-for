import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-hint}}', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a hint', async function(assert) {
    await render(hbs`{{form-hint hint="This is a hint"}}`);
    assert.dom('span').hasText('This is a hint');
  });

  test('It doesn\'t renders a thing', async function(assert) {
    await render(hbs`{{form-hint}}`);
    assert.dom('span').doesNotExist();
  });

  test('It can be passed an id', async function(assert) {
    await render(hbs`{{form-hint hint="This is a hint" hintId="hint1"}}`);
    assert.dom('span#hint1').exists({ count: 1 });
  });
});
