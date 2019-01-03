import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form fields/hidden field', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { givenName: 'Albert' });
      this.set('propertyName', 'givenName');
    };
  });

  test('It does not renders a label for a hidden field', async function(assert) {
    await render(hbs`{{form-fields/hidden-field propertyName object=object}}`);
    assert.dom('input[type="hidden"]').exists({ count: 1 });
    assert.dom('label').doesNotExist();
  });
});
