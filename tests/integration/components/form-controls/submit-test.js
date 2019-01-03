import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{form-controls/submit}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('It renders a submit button', async function(assert) {
    await render(hbs`{{form-controls/submit}}`);
    assert.dom('button').hasAttribute('type', 'submit', 'Submit button is rendered');
  });

  test('It renders a user-defined submit button', async function(assert) {
    await render(hbs`
      {{#form-controls/submit}}
        foo
      {{/form-controls/submit}}
    `);

    assert.dom('button').hasText('foo', 'Submit button shows user defined label');
  });

  test('Clicking the submit button triggers the "submit" action', async function(assert) {
    assert.expect(1);
    this.actions.submit = () => assert.ok(true);
    await render(hbs`{{form-controls/submit submit=(action 'submit')}}`);
    await click('button');
  });

  test('Clicking the submit button triggers the "action" action', async function(assert) {
    assert.expect(1);
    this.actions.submit = () => assert.ok(true);
    await render(hbs`{{form-controls/submit action=(action 'submit')}}`);
    await click('button');
  });

  test('Clicking the submit button supports returning a promise', async function(assert) {
    assert.expect(4);
    let promise = new RSVP.Promise((resolve) => {
      run.later(this, () => {
        resolve();
      }, 500);
    });

    this.actions.submit = () => {
      return promise;
    };
    await render(hbs`{{form-controls/submit action=(action 'submit')}}`);
    let $button = this.$('button');

    $button.trigger('click');
    assert.equal($button.text().trim(), 'Submitting...', 'Button state changes on pending promise');
    assert.equal(true, $button[0].disabled, 'Button should be disabled when promise is pending');

    return settled().then(() => {
      promise.then(() => {
        assert.ok(true);
        assert.equal($button.text().trim(), 'Submit', 'Button state returns on fulfilled promise');
      });
    });
  });

  test('Clicking the submit button supports returns to default state with reset=True', async function(assert) {
    assert.expect(4);
    let promise = new RSVP.Promise((resolve) => {
      run.later(this, () => {
        resolve();
      }, 500);
    });

    this.actions.submit = () => {
      return promise;
    };
    await render(hbs`{{form-controls/submit action=(action 'submit') reset=true fulfilled='Succeed'}}`);
    let $button = this.$('button');

    $button.trigger('click');
    assert.equal($button.text().trim(), 'Submitting...', 'Button state changes on pending promise');
    assert.equal(true, $button[0].disabled, 'Button should be disabled when promise is pending');

    return settled().then(() => {
      promise.then(() => {
        assert.ok(true);
        assert.equal($button.text().trim(), 'Submit', 'Button state returns on fulfilled promise');
      });
    });
  });

  test('Clicking the submit button supports user defined text for fulfilled action', async function(assert) {
    assert.expect(4);
    let promise = new RSVP.Promise((resolve) => {
      run.later(this, () => {
        resolve();
      }, 500);
    });

    this.actions.submit = () => {
      return promise;
    };
    await render(hbs`{{form-controls/submit action=(action 'submit') fulfilled='foo'}}`);
    let $button = this.$('button');

    $button.trigger('click');
    assert.equal($button.text().trim(), 'Submitting...', 'Button state changes on pending promise');
    assert.equal(true, $button[0].disabled, 'Button should be disabled when promise is pending');

    return settled().then(() => {
      promise.then(() => {
        assert.ok(true);
        assert.equal($button.text().trim(), 'foo', 'Button state returns on fulfilled promise');
      });
    });
  });

  test('Clicking the submit button supports returning a promise and changes user-defined content', async function(assert) {
    assert.expect(3);
    let promise = new RSVP.Promise((resolve) => {
      run.later(this, () => {
        resolve();
      }, 500);
    });

    this.actions.submit = () => {
      return promise;
    };
    await render(hbs`
      {{#form-controls/submit action=(action 'submit') as |t promise|}}
        {{promise.isPending}}--{{promise.isFulfilled}}--{{promise.isSettled}}--{{promise.isRejected}}
      {{/form-controls/submit}}
    `);
    let $button = this.$('button');

    $button.trigger('click');
    assert.equal($button.text().trim(), 'true--false--false--false', 'Button state changes on pending promise');

    return settled().then(() => {
      promise.then(() => {
        assert.ok(true);
        assert.equal($button.text().trim(), 'false--true--true--false', 'Button state returns on fulfilled promise');
      });
    });
  });

  test('It renders custom text', async function(assert) {
    await render(hbs`{{form-controls/submit 'Test'}}`);
    assert.dom('button').hasText('Test', 'Submit button shows label');
  });

  test("it's possible to bind 'formaction'", async function(assert) {
    await render(hbs`{{form-controls/submit formaction="http://example.com/form"}}`);
    assert.dom('button').hasAttribute('formaction', 'http://example.com/form', 'attribute formaction is set');
  });

  test("it's possible to bind 'formenctype'", async function(assert) {
    await render(hbs`{{form-controls/submit formenctype="text/plain"}}`);
    assert.dom('button').hasAttribute('formenctype', 'text/plain', 'attribute formenctype is set');
  });

  test("it's possible to bind 'formmethod'", async function(assert) {
    await render(hbs`{{form-controls/submit formmethod="POST"}}`);
    assert.dom('button').hasAttribute('formmethod', 'POST', 'attribute formmethod is set');
  });

  test("it's possible to bind 'formtarget'", async function(assert) {
    await render(hbs`{{form-controls/submit formtarget="_blank"}}`);
    assert.dom('button').hasAttribute('formtarget', '_blank', 'attribute formtarget is set');
  });

  test("it's possible to bind 'formnovalidate'", async function(assert) {
    await render(hbs`{{form-controls/submit formnovalidate="formnovalidate"}}`);
    assert.dom('button').hasAttribute('formnovalidate', 'formnovalidate', 'attribute formnovalidate is set');
  });
});
