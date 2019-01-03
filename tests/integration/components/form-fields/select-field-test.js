import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form fields/select field', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { gender: 'male' });
      this.set('propertyName', 'gender');
      this.set('options', 'male female unknown');
    };
  });

  test('It renders a select box and label', async function(assert) {
    await render(hbs`
      {{form-fields/select-field propertyName options object=object}}`);

    assert.dom('select').exists({ count: 1 });
    assert.dom('option').exists({ count: 3 });
    assert.dom('label').exists({ count: 1 });
  });
});
