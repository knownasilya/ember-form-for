import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { initialize as formForInitializer } from 'dummy/instance-initializers/form-for-initializer';
import config from 'dummy/config/environment';
import FormForComponent from 'ember-form-for/components/form-for';

module('Integration | Component | {{form-for}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.set('object', { name: 'Peter' });
  });

  hooks.afterEach(function() {
    delete config['ember-form-for'];
    FormForComponent.reopen({
      customFormFields: null
    });
  });

  test('It renders a form element', async function(assert) {
    await render(hbs`{{form-for}}`);

    assert.dom('form').exists({ count: 1 });
  });

  test('The form attribute sets the id of the form element', async function(assert) {
    await render(hbs`{{form-for form="the-form"}}`);

    assert.equal(find('form').id, 'the-form');
  });

  test('It yields an helper for rendering form components', async function(assert) {
    await render(hbs`
      {{#form-for object as |f|}}
        {{f.text-field "name"}}
      {{/form-for}}
    `);

    assert.dom('form input[type="text"]').exists({ count: 1 });
  });

  test('It puts the given attribute\'s value in the input', async function(assert) {
    await render(hbs`
      {{#form-for object as |f|}}
        {{f.text-field "name"}}
      {{/form-for}}
    `);

    let $input = this.$('form input[type="text"]');

    assert.equal($input.val(), 'Peter');
  });

  test('By default object properties are updated on typing', async function(assert) {
    await render(hbs`
      {{#form-for object as |f|}}
        {{f.text-field "name"}}
      {{/form-for}}
    `);

    let $input = this.$('form input[type="text"]');

    run(() => {
      $input.val('Robert');
      $input.trigger('input');
    });

    assert.equal(this.get('object.name'), 'Robert');
  });

  test('It passes an update action to the fields', async function(assert) {
    assert.expect(1);
    this.actions.update = (object, propertyName, value) => {
      assert.equal(value, 'Robert');
    };

    await render(hbs`
      {{#form-for object update=(action 'update') as |f|}}
        {{f.text-field "name"}}
      {{/form-for}}
    `);

    let $input = this.$('form input[type="text"]');
    $input.val('Robert');
    $input.trigger('input');
  });

  test('Adding a custom field', async function(assert) {
    await render(hbs`
      {{#form-for object as |f|}}
        {{f.custom-field "name" control="one-way-search"}}
      {{/form-for}}
    `);

    assert.dom('form input[type="search"]').exists({ count: 1 });
  });

  test('Adding a custom field with template', async function(assert) {
    await render(hbs`
      {{#form-for object as |f|}}
        {{#f.custom-field "name" as |ff|}}
          {{ff.control}}
        {{/f.custom-field}}
      {{/form-for}}
    `);

    assert.dom('form input').exists({ count: 1 });
  });

  test('It\'s helper can render a submit button', async function(assert) {
    assert.expect(1);
    this.actions.submit = (object) => assert.equal(object, this.get('object'));
    await render(hbs`
      {{#form-for object submit=(action 'submit') as |f|}}
        {{f.submit}}
      {{/form-for}}
    `);

    await click('button[type="submit"]');
  });

  test('Submit calls object#save by default', async function(assert) {
    assert.expect(1);
    this.set('object', { save: () => assert.ok(true) });

    await render(hbs`
      {{#form-for object as |f|}}
        {{f.submit}}
      {{/form-for}}
    `);

    await click('button[type="submit"]');
  });

  test('It\'s helper can render a reset button', async function(assert) {
    assert.expect(1);
    this.actions.reset = (object) => assert.equal(object, this.get('object'));
    await render(hbs`
      {{#form-for object reset=(action 'reset') as |f|}}
        {{f.reset}}
      {{/form-for}}
    `);

    await click('button[type="reset"]');
  });

  test('Reset calls object#rollback by default', async function(assert) {
    assert.expect(1);
    this.set('object', { rollback: () => assert.ok(true) });

    await render(hbs`
      {{#form-for object as |f|}}
        {{f.reset}}
      {{/form-for}}
    `);

    await click('button[type="reset"]');
  });

  test('Form is focused when submit action is triggered and object contains errors', async function(assert) {
    this.set('object', {
      save: () => undefined,
      errors: {
        foo: [{ message: 'error' }]
      }
    });

    await render(hbs`
      {{#form-for object as |f|}}
        {{f.submit}}
      {{/form-for}}
    `);

    run(async () => await click('button[type="submit"]'));
    assert.equal(document.activeElement, findAll('form')[0]);
  });

  test('I can set and configure custom formClasses', async function(assert) {
    config['ember-form-for'] = {
      formClasses: ['custom-form-class-1']
    };

    formForInitializer(this.container);

    await render(hbs`{{form-for}}`);

    assert.dom('.custom-form-class-1').exists({ count: 1 });
  });

  test('It passes down the form attribute to fields', async function(assert) {
    await render(hbs`
      {{#form-for object form="user" as |f|}}
        {{f.text-field "name"}}
      {{/form-for}}
    `);

    assert.dom('form input').hasAttribute('name', 'user[name]');
  });
});
