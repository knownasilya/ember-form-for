import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import registerI18n from '../../../support/register-i18n';

module('Integration | Component | {{form-fields/checkbox-group}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('object', { preferences: ['dogs'] });
      this.set('options', ['dogs', 'cats']);
    };
  });

  test('It renders a fieldset', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "preferences" object=object}}`);
    assert.dom('fieldset').exists({ count: 1 });
  });

  test('It adds a legend with the label text', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "preferences" object=object}}`);
    assert.dom('legend').hasText('Preferences');
  });

  test('It renders a list of checkboxes with label for each option', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "preferences" object=object options=options}}`);
    assert.dom('ul li label input[type="checkbox"]').exists({ count: 2 });
  });

  test('The selected options is checked', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "preferences" object=object options=options}}`);
    assert.dom('input[type="checkbox"]').isChecked();
    assert.dom('input[type="checkbox"]:checked').hasValue('dogs');
  });

  test('Disabled true disables all checkboxes', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "gender" disabled=true object=object options=options}}`);
    assert.dom('input[type="checkbox"]').isDisabled();
  });

  test('Clicking a checkbox updates the property', async function(assert) {
    await render(hbs`{{form-fields/checkbox-group "preferences" object=object options=options}}`);

    run(async () => await click(findAll('input')[1]));

    assert.dom('input[type="checkbox"]').isChecked();
    assert.deepEqual(this.get('object.preferences'), ['dogs', 'cats']);

    run(async () => await click(find('input')));

    assert.dom('input[type="checkbox"]').isChecked();
    assert.deepEqual(this.get('object.preferences'), ['cats']);
  });

  test('The labels are computed from the i18n service if available', async function(assert) {
    assert.expect(2);
    registerI18n(this, EmberObject.extend({
      t(key) {
        return key;
      }
    }));

    await render(hbs`{{form-fields/checkbox-group "preferences" object=object options=options}}`);

    assert.equal(this.$('label').eq(0).text().trim(), 'preferences.dogs');
    assert.equal(this.$('label').eq(1).text().trim(), 'preferences.cats');
  });
});
