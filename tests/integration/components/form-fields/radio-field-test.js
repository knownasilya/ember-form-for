import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import registerI18n from '../../../support/register-i18n';

module('Integration | Component | form fields/radio field', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a label and a checkbox', async function(assert) {
    this.set('object', { accepted: true });
    await render(hbs`{{form-fields/radio-field "accepted" true object=object}}`);
    assert.dom('input[type="radio"]').exists({ count: 1 });
    assert.dom('input').hasValue('true');
    assert.dom('label').exists({ count: 1 });
    assert.dom('label').hasText('True');
  });

  test('The label is computed from the i18n service if available', async function(assert) {
    this.set('object', { accepted: true });
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'accepted.true');
        return 'Accept Terms of Service';
      }
    }));

    await render(hbs`{{form-fields/radio-field "accepted" true object=object}}`);

    assert.dom('label').hasText('Accept Terms of Service');
  });

  test('When modelName is present, use it for i18n labels', async function(assert) {
    this.set('object', { modelName: 'registration', accepted: true });
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'registration.accepted.true');
        return 'Accept Terms of Service';
      }
    }));

    await render(hbs`{{form-fields/radio-field "accepted" true object=object}}`);

    assert.dom('label').hasText('Accept Terms of Service');
  });
});
