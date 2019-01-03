import EmberObject from '@ember/object';
import Service from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import registerI18n from '../../support/register-i18n';

module('Integration | Component | {{form-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.set('object', { givenName: 'Albert' });
  });

  test('It requires an object', function(assert) {
    assert.throws(async () => {
      await render(hbs`{{form-field}}`);
    }, /{{form-field}} requires an object property to be passed in/);
  });

  test('It requires a propertyName', function(assert) {
    assert.throws(async () => {
      await render(hbs`{{form-field object=object}}`);
    }, /{{form-field}} requires the propertyName property to be set/);
  });

  test('It adds a label based on propertyName', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.label}}{{/form-field}}
    `);
    assert.dom('label').hasText('Given name');
  });

  test('If the i18n service is available, compute the label from there', async function(assert) {
    assert.expect(2);
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'given-name');
        return 'Your name';
      }
    }));

    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.label}}{{/form-field}}
    `);

    assert.dom('label').hasText('Your name');
  });

  test('If the i18n service is available, and changeset has been used, compute the label from there', async function(assert) {
    assert.expect(2);
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'given-name');
        return 'Your name';
      }
    }));

    this.set('changeset', {
      _content: this.get('object')
    });

    await render(hbs`
      {{#form-field "givenName" object=changeset as |f|}}{{f.label}}{{/form-field}}
    `);

    assert.dom('label').hasText('Your name');
  });

  test('When modelName is present, use it for i18n labels', async function(assert) {
    assert.expect(2);
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'user.given-name');
        return 'Your name';
      }
    }));

    this.set('object.modelName', 'user');

    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.label}}{{/form-field}}
    `);

    assert.dom('label').hasText('Your name');
  });

  test('An arbitrary prefix can be used for the i18n key', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      i18nKeyPrefix: 'arbitrary'
    }));

    assert.expect(2);
    registerI18n(this, EmberObject.extend({
      t(key) {
        assert.equal(key, 'arbitrary.given-name');
        return 'Your name';
      }
    }));

    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.label}}{{/form-field}}
    `);

    assert.dom('label').hasText('Your name');
  });

  test('It yields a text input as a default control', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.control}}{{/form-field}}
    `);
    assert.dom('input[type="text"]').exists({ count: 1 });
  });

  test('A custom form control can be specified', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object control="one-way-search" as |f|}}
        {{f.control}}
      {{/form-field}}
    `);
    assert.dom('input[type="search"]').exists({ count: 1 });
  });

  test('It sets the "for" attr of the label and the "id" attr of the input', async function(assert) {
    let expectedId = 'test123_givenName';
    await render(hbs`
      {{#form-field "givenName" id="test123" object=object as |f|}}
        {{f.label}}{{f.control}}
      {{/form-field}}
    `);
    assert.dom('label').hasAttribute('for', expectedId);
    assert.equal(find('input').id, expectedId);
  });

  test('It uses the form property as fieldId if possible', async function(assert) {
    let expectedId = 'form123_givenName';
    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.label}}{{f.control}}
      {{/form-field}}
    `);
    assert.dom('label').hasAttribute('for', expectedId);
    assert.equal(find('input').id, expectedId);
  });

  test('It sets the "name" attribute of input', async function(assert) {
    let expectedName = `${guidFor(this.get('object'))}[givenName]`;
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.control}}{{/form-field}}
    `);
    assert.dom('input').hasAttribute('name', expectedName);
  });

  test('Property modelName is used in the "name" attribute if present on object', async function(assert) {
    this.set('object.constructor', { modelName: 'person' });
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.control}}{{/form-field}}
    `);
    assert.dom('input').hasAttribute('name', 'person[givenName]');
  });

  test('It sets the value of the input to the value of the propertyName on object', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}{{f.control}}{{/form-field}}
    `);
    assert.dom('input').hasValue(this.get('object.givenName'));
  });

  test('It passes the form attribute to the label and control', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.label}}{{f.control}}
      {{/form-field}}
    `);
    assert.dom('label').hasAttribute('form', 'form123');
    assert.dom('input').hasAttribute('form', 'form123');
  });

  test('It can display errors', async function(assert) {
    this.set('object.errors', { givenName: [{ message: 'can\'t be blank' }] });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('can\'t be blank') !== -1);
  });

  test('Displays errors at the correct errorsPath', async function(assert) {
    this.set('object.error', {
      givenName: {
        validation: [
          {
            message: 'pizza'
          }
        ]
      }
    });
    this.set('config', { errorsPath: 'error.PROPERTY_NAME.validation' });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" config=config as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('pizza') !== -1);
  });

  test('Still respects errorsProperty if no errorsPath is defined', async function(assert) {
    this.set('object.foo', {
      givenName: [
        {
          message: 'pizza'
        }
      ]
    });
    this.set('config', { errorsProperty: 'foo' });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" config=config as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('pizza') !== -1);
  });

  test('errorsPath takes priority over errorsProperty', async function(assert) {
    this.set('object.foo', {
      givenName: {
        validation: [
          {
            message: 'pizza'
          }
        ]
      }
    });
    this.set('config', { errorsProperty: 'foo', errorsPath: 'foo.PROPERTY_NAME.validation' });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" config=config as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('pizza') !== -1);
  });

  test('It exposes hasErrors', async function(assert) {
    this.set('object.errors', { givenName: [{ message: 'can\'t be blank' }] });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{#if f.hasErrors}}
          I HAZ ERRORS
        {{/if}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('I HAZ ERRORS') !== -1);
  });

  test('I can configure on which property errors are found', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      errorsProperty: ['error']
    }));

    this.set('object.error', { givenName: [{ message: 'can\'t be blank' }] });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.ok(find('*').textContent.trim().indexOf('can\'t be blank') !== -1);
  });

  test('The errors messages are linked to the control by aria-describedby', async function(assert) {
    this.set('object.errors', {
      givenName: [
        { message: 'can\'t be blank' },
        { message: 'is required' }
      ]
    });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.control}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.equal(find('[role="alert"]').id, 'form123_givenName_error-0');
    assert.equal(find(findAll('[role="alert"]')[1]).id, 'form123_givenName_error-1');
    assert.dom('input').hasAttribute('aria-describedby', 'form123_givenName_error-0 form123_givenName_error-1');
  });

  test('Required is passed down to the control and hint', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object required=true as |f|}}
        {{f.label}}
        {{f.control}}
      {{/form-field}}
    `);

    assert.dom('input').hasAttribute('required', 'required', 'Required is set');
    assert.ok(find('label').textContent.indexOf('*') !== -1, 'Star is added to label');
  });

  test('By default changing the input updates the value', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}
        {{f.label}}{{f.control}}
      {{/form-field}}
    `);
    await fillIn('input', 'Mark');
    assert.equal(this.get('object.givenName'), 'Mark');
  });

  test('A custom update action can be passed', async function(assert) {
    assert.expect(1);
    this.actions.update = (object, propertyPath, value) => assert.equal(value, 'Mark');
    await render(hbs`
      {{#form-field "givenName" object=object update=(action 'update') as |f|}}
        {{f.label}}{{f.control}}
      {{/form-field}}
    `);
    await fillIn('input', 'Mark');
  });

  test('It can yield the labelText', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}
        {{f.labelText}}
      {{/form-field}}
    `);
    assert.dom('*').hasText('Given name');
  });

  test('It can yield a hint', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object hint="This is a hint" as |f|}}
        {{f.hint}}
      {{/form-field}}
    `);
    assert.dom('span').hasText('This is a hint');
  });

  test('It sets the describedBy of the control to the id of the hint', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" id="test123" object=object hint="This is a hint" as |f|}}
        {{f.control}}
        {{f.hint}}
      {{/form-field}}
    `);
    let expectedId = 'test123_givenName_hint';
    assert.equal(find('span').id, expectedId);
    assert.dom('input').hasAttribute('aria-describedby', expectedId);
  });

  test('It does not set the describedBy of the control when there are no ids', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" id="test123" object=object as |f|}}
        {{f.control}}
      {{/form-field}}
    `);
    assert.dom('input').hasAttribute('aria-describedby', null);
  });

  test('It passes invalid to the control when errors are present', async function(assert) {
    this.set('object.errors', { givenName: [{ message: 'can\'t be blank' }] });

    await render(hbs`
      {{#form-field "givenName" object=object form="form123" as |f|}}
        {{f.control}}
      {{/form-field}}
    `);

    assert.dom('input').hasAttribute('aria-invalid', 'true');
  });

  test('I can set and configure custom fieldClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      fieldClasses: ['custom-class-1']
    }));

    this.set('fieldClasses', ['custom-class-2']);
    await render(hbs`
      {{#form-field "givenName" object=object class=fieldClasses as |f|}}
        {{f.control}}
      {{/form-field}}
    `);

    assert.dom('.custom-class-1').exists({ count: 1 });
    assert.dom('.custom-class-2').exists({ count: 1 });
  });

  test('I can set and configure custom inputClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      inputClasses: ['custom-class-1']
    }));

    this.set('inputClasses', ['custom-class-2']);
    await render(hbs`
      {{#form-field "givenName" object=object inputClasses=inputClasses as |f|}}
        {{f.control}}
      {{/form-field}}
    `);

    assert.dom('input').hasClass('custom-class-1');
    assert.dom('input').hasClass('custom-class-2');
  });

  test('I can set and configure custom labelClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      labelClasses: ['custom-class-1']
    }));

    this.set('labelClasses', ['custom-class-2']);
    await render(hbs`
      {{#form-field "givenName" object=object labelClasses=labelClasses as |f|}}
        {{f.label}}
      {{/form-field}}
    `);

    assert.dom('label').hasClass('custom-class-1');
    assert.dom('label').hasClass('custom-class-2');
  });

  test('I can set and configure custom hintClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      hintClasses: ['custom-class-1']
    }));

    this.set('hintClasses', ['custom-class-2']);
    await render(hbs`
      {{#form-field "givenName" object=object hint="test" hintClasses=hintClasses as |f|}}
        {{f.hint}}
      {{/form-field}}
    `);

    assert.dom('span').hasClass('custom-class-1');
    assert.dom('span').hasClass('custom-class-2');
  });

  test('I can set custom errorClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      errorClasses: ['custom-error-1']
    }));

    this.set('object.errors', { givenName: [{ message: 'can\'t be blank' }] });
    this.set('errorClasses', ['custom-error-2']);
    await render(hbs`
      {{#form-field "givenName" object=object errorClasses=errorClasses as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.dom('.custom-error-1').exists({ count: 1 });
    assert.dom('.custom-error-2').exists({ count: 1 });
  });

  test('I can set a custom fieldHasErrorClasses', async function(assert) {
    this.owner.register('service:ember-form-for/config', Service.extend({
      fieldHasErrorClasses: ['has-errors-custom']
    }));

    this.set('object.errors', { givenName: [{ message: 'can\'t be blank' }] });
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}
        {{f.errors}}
      {{/form-field}}
    `);

    assert.dom('.has-errors-custom').exists({ count: 1 });
  });

  test('I can pass a serializeValue function', async function(assert) {
    this.set('serializeValue', (value) => {
      return value.toUpperCase();
    });
    await render(hbs`
      {{#form-field "givenName" object=object serializeValue=serializeValue as |f|}}
        {{f.control}}
      {{/form-field}}
    `);
    assert.dom('input').hasValue('ALBERT', 'Value is uppercased');
  });

  test('I can pass a deserializeValue function', async function(assert) {
    this.set('deserializeValue', (value) => {
      return value.toUpperCase();
    });
    await render(hbs`
      {{#form-field "givenName" object=object deserializeValue=deserializeValue as |f|}}
        {{f.control}}
      {{/form-field}}
    `);
    run(() => this.$('input').val('John').trigger('change'));
    assert.equal(this.get('object.givenName'), 'JOHN', 'Value is uppercased');
  });

  test('By default the objectId is used in as the control name', async function(assert) {
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}
         {{f.control}}
      {{/form-field}}
    `);

    assert.ok(find('input').getAttribute('name').match(/^ember\d+\[givenName\]$/));
  });

  test('If the object has a modelname it uses that for the control name', async function(assert) {
    this.set('object.constructor', { modelName: 'person' });
    await render(hbs`
      {{#form-field "givenName" object=object as |f|}}
         {{f.control}}
      {{/form-field}}
    `);

    assert.dom('input').hasAttribute('name', 'person[givenName]');
  });

  test('If form was passed it uses that for the control name', async function(assert) {
    this.set('object.constructor', { modelName: 'person' });
    await render(hbs`
      {{#form-field "givenName" object=object form="user" as |f|}}
         {{f.control}}
      {{/form-field}}
    `);

    assert.dom('input').hasAttribute('name', 'user[givenName]');
  });
});
