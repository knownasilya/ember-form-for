import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { initialize as formForInitializer } from 'dummy/instance-initializers/form-for-initializer';
import config from 'dummy/config/environment';

module('Integration | Component | {{form-controls/button}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.teardown = function() {
      delete config['ember-form-for'];
    };

    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('It renders a button', async function(assert) {
    await render(hbs`{{form-controls/button}}`);
    assert.dom('button').exists({ count: 1 }, 'Button is rendered');
  });

  test('The type of the button is "button"', async function(assert) {
    await render(hbs`{{form-controls/button}}`);
    assert.dom('button').hasAttribute('type', 'button', 'Type is button');
  });

  test('It can be passed a label value', async function(assert) {
    await render(hbs`{{form-controls/button label="TEST"}}`);
    assert.dom('button').hasText('TEST', 'The text on the button is TEST');
  });

  test('The label can also be a block', async function(assert) {
    await render(hbs`{{#form-controls/button}}TEST{{/form-controls/button}}`);
    assert.dom('button').hasText('TEST', 'The text on the button is TEST');
  });

  test('It can have a label value specified as a positional param', async function(assert) {
    await render(hbs`{{form-controls/button "Click Me"}}`);
    assert.dom('button').hasText('Click Me', 'Button has "Click Me" as label');
  });

  test('Clicking the button triggers the click action', async function(assert) {
    assert.expect(1);
    this.actions.click = () => assert.ok(true);
    await render(hbs`{{form-controls/button click=(action 'click')}}`);
    await click('button');
  });

  test('I can set and configure custom buttonClasses', async function(assert) {
    config['ember-form-for'] = {
      buttonClasses: ['custom-class-1']
    };

    formForInitializer(this.container);

    this.set('buttonClasses', ['custom-class-2']);
    await render(hbs`{{form-controls/button class=buttonClasses}}`);

    assert.dom('.custom-class-1').exists({ count: 1 });
    assert.dom('.custom-class-2').exists({ count: 1 });
  });

  test('I can set the disabled attribute', async function(assert) {
    await render(hbs`{{form-controls/button disabled=true}}`);
    assert.dom('button').hasAttribute('disabled', 'disabled', 'disabled is set to true');
  });

  test('I can set the aria-controls attribute', async function(assert) {
    await render(hbs`{{form-controls/button aria-controls="foo"}}`);
    assert.dom('button').hasAttribute('aria-controls', 'foo', 'aria-controls is set to foo');
  });
});
