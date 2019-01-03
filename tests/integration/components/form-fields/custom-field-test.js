import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/custom-field}}', function(hooks) {
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
    await render(hbs`{{form-fields/custom-field propertyName object=object}}`);
    assert.dom('input[type="text"]').exists({ count: 1 });
    assert.dom('label').exists({ count: 1 });
  });

  test('Passing a custom template', async function(assert) {
    await render(hbs`
      {{#form-fields/custom-field propertyName object=object as |f|}}
        {{f.control}}
      {{/form-fields/custom-field}}
    `);
    assert.dom('input[type="text"]').exists({ count: 1 });
  });

  test('By default changing the input updates the value', async function(assert) {
    await render(hbs`{{form-fields/custom-field propertyName object=object}}`);
    await fillIn('input', 'Mark');
    assert.equal(this.get('object.givenName'), 'Mark');
  });

  test('A custom update action can be passed', async function(assert) {
    assert.expect(1);
    this.actions.update = (object, propertyPath, value) => assert.equal(value, 'Mark');
    await render(hbs`{{form-fields/custom-field propertyName object=object update=(action 'update')}}`);
    await fillIn('input', 'Mark');
  });

  test('A custom component can be passed', async function(assert) {
    this.owner.register('component:my-custom-form-field', Component.extend({
      layout: hbs`<span>{{f.label}}</span><span>{{f.control}}</span>`
    }));

    await render(
      hbs`{{form-fields/custom-field propertyName object=object component=(component "my-custom-form-field")}}`
    );

    assert.dom('span label').exists({ count: 1 }, 'The label is rendered in a span');
    assert.dom('span input').exists({ count: 1 }, 'The input is rendered in a span');
  });
});
