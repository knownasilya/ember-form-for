import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-controls/reset}}', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a reset button', async function(assert) {
    await render(hbs`{{form-controls/reset}}`);
    assert.dom('button').hasAttribute('type', 'reset', 'Reset button is rendered');
  });
});
