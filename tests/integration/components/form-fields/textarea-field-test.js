import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form fields/textarea field', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a label and a textarea', async function(assert) {
    this.set('object', { description: 'Lorem Ipsum' });
    await render(hbs`{{form-fields/textarea-field "description" object=object}}`);
    assert.dom('textarea').exists({ count: 1 });
    assert.dom('label').exists({ count: 1 });
  });
});
