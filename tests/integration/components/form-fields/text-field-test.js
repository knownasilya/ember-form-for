import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form fields/text field', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { givenName: 'Albert' });
      this.set('propertyName', 'givenName');
    };

    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('It renders a label and a text input', async function(assert) {
    await render(hbs`{{form-fields/text-field propertyName object=object}}`);
    assert.dom('input[type="text"]').exists({ count: 1 });
    assert.dom('label').exists({ count: 1 });
  });

  test('By default changing the input updates the value', async function(assert) {
    await render(hbs`{{form-fields/text-field propertyName object=object}}`);
    await fillIn('input', 'Mark');
    assert.equal(this.get('object.givenName'), 'Mark');
  });

  test('A custom update action can be passed', async function(assert) {
    assert.expect(1);
    this.actions.update = (object, propertyPath, value) => assert.equal(value, 'Mark');
    await render(hbs`{{form-fields/text-field propertyName object=object update=(action 'update')}}`);
    await fillIn('input', 'Mark');
  });
});
