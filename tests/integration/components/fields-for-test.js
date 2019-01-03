import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{fieldset-for}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { name: 'Peter' });
    };
  });

  test('It yields an helper for rendering form components', async function(assert) {
    await render(hbs`
      {{#fields-for object as |f|}}
        {{f.text-field "name"}}
      {{/fields-for}}
    `);

    assert.dom('input[type="text"]').exists({ count: 1 });
  });

  test('It puts the given attribute\'s value in the input', async function(assert) {
    await render(hbs`
      {{#fields-for object as |f|}}
        {{f.text-field "name"}}
      {{/fields-for}}
    `);

    let $input = this.$('input[type="text"]');

    assert.equal($input.val(), 'Peter');
  });

  test('By default object properties are updated on typing', async function(assert) {
    await render(hbs`
      {{#fields-for object as |f|}}
        {{f.text-field "name"}}
      {{/fields-for}}
    `);

    let $input = this.$('input[type="text"]');

    run(() => {
      $input.val('Robert');
      $input.trigger('input');
    });

    assert.equal(this.get('object.name'), 'Robert');
  });
});
