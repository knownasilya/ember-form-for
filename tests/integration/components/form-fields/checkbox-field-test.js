import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import registerI18n from '../../../support/register-i18n';

module('Integration | Component | form fields/checkbox field', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a label and a checkbox', async function(assert) {
    this.set('object', { accepted: false });
    await render(hbs`{{form-fields/checkbox-field "accepted" object=object}}`);
    assert.dom('input[type="checkbox"]').exists({ count: 1 });
    assert.dom('label').exists({ count: 1 });
  });

  test('The label is computed from the i18n service if available', async function(assert) {
    this.set('object', { accepted: true });
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'accepted');
        return 'Accept Terms of Service';
      }
    }));

    await render(hbs`{{form-fields/checkbox-field "accepted" object=object}}`);

    assert.dom('label').hasText('Accept Terms of Service');
  });
});
