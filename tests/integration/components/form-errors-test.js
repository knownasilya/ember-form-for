import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-errors}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function() {
      this.set('errors', [
        { message: 'can\'t be blank' },
        { message: 'must be unique' }
      ]);
    };
  });

  test('It renders errors', async function(assert) {
    await render(hbs`{{form-errors errors=errors}}`);
    let text = find('*').textContent.trim();
    assert.ok(text.indexOf('can\'t be blank') !== -1);
    assert.ok(text.indexOf('must be unique') !== -1);
  });

  test('Errors can optionally just be a string', async function(assert) {
    this.set('errors', ['must be unique']);
    await render(hbs`{{form-errors errors=errors}}`);
    assert.ok(find('*').textContent.indexOf('must be unique') !== -1);
  });

  test('It renders nothing when no errors present', async function(assert) {
    await render(hbs`{{form-errors}}`);
    assert.dom('*').doesNotExist();
  });

  test('Errors have role=alert', async function(assert) {
    await render(hbs`{{form-errors errors=errors}}`);
    assert.dom('div[role="alert"]').exists({ count: 2 });
  });

  test('Each error has an id set', async function(assert) {
    await render(hbs`{{form-errors errorId="test_error" errors=errors}}`);
    assert.equal(find('div[role="alert"]').id, 'test_error-0');
    assert.equal(find(findAll('div[role="alert"]')[1]).id, 'test_error-1');
  });

  test('errorTagName set the tagname for errors', async function(assert) {
    await render(hbs`{{form-errors errors=errors errorsTagName="span"}}`);
    assert.dom('span').exists({ count: 1 });
  });

  test('messageTagName set the tagname for a message', async function(assert) {
    await render(hbs`{{form-errors errors=errors messageTagName="span"}}`);
    assert.dom('span').exists({ count: 2 });
  });

  test('maxErrors displays max n errors', async function(assert) {
    await render(hbs`{{form-errors errors=errors maxErrors=1}}`);
    assert.dom('div[role="alert"]').exists({ count: 1 });
  });
});
