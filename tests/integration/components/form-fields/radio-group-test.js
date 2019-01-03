import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-fields/radio-group}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { gender: 'female' });
      this.set('options', [{ value: 'male' }, { value: 'female' }, { value: 'unknown' }]);
    };
  });

  test('It renders a fieldset', async function(assert) {
    await render(hbs`{{form-fields/radio-group "gender" object=object}}`);
    assert.dom('fieldset').exists({ count: 1 });
  });

  test('It adds a legend with the label text', async function(assert) {
    await render(hbs`{{form-fields/radio-group "gender" object=object}}`);
    assert.dom('legend').hasText('Gender');
  });

  test('It renders a list of radios with label for each option', async function(assert) {
    await render(hbs`{{form-fields/radio-group "gender" object=object options=options}}`);
    assert.dom('ul li label input[type="radio"]').exists({ count: 3 });
    assert.dom(find('ul li:first-child label')).hasText('Male');
  });

  test('It renders a list of radios with custom labels for each option', async function(assert) {
    this.set('options', [{ value: 'male', label: 'Man' }, { value: 'female', label: 'Woman' }, { value: 'unknown', label: 'Unknown' }]);
    await render(hbs`{{form-fields/radio-group "gender" object=object options=options}}`);
    assert.dom('ul li label input[type="radio"]').exists({ count: 3 });
    assert.dom(find('ul li:first-child label')).hasText('Man');
  });

  test('It renders a list of radios with custom labels for each option in block mode', async function(assert) {
    this.set('options', [{ value: 'male', label: 'Man' }, { value: 'female', label: 'Woman' }, { value: 'unknown', label: 'Unknown' }]);
    await render(hbs`
      {{#form-fields/radio-group "gender" object=object options=options as |controls|}}
        {{controls.radio-field labelClasses='radio-inline'}}
      {{/form-fields/radio-group}}
    `);
    assert.dom('ul li label.radio-inline input[type="radio"]').exists({ count: 3 });
    assert.dom(find('ul li:first-child label.radio-inline')).hasText('Man');
  });

  test('Disabled true disables all radios', async function(assert) {
    await render(hbs`{{form-fields/radio-group "gender" disabled=true object=object options=options}}`);
    assert.dom('input[type="radio"]').isDisabled();
  });
});
