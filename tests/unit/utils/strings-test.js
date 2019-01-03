import { humanize, titlecase } from 'ember-form-for/utils/strings';
import { module, test } from 'qunit';

module('Unit | Utility | humanize', function() {
  test('Humanize a camelCased string', (assert) => {
    assert.equal(humanize('myFirstName'), 'My first name');
  });

  test('Humanize a under_scored string', (assert) => {
    assert.equal(humanize('first_name'), 'First name');
  });

  test('Humanize a dash-erized string', (assert) => {
    assert.equal(humanize('first-name'), 'First name');
  });

  test('Humanize a space seperated string', (assert) => {
    assert.equal(humanize('first name'), 'First name');
  });

  test('Humanize a dot seprated string', (assert) => {
    assert.equal(humanize('first.name'), 'First name');
  });
});

module('Unit | Utility | titlecase', function() {
  test('Titlecase a camelCased string', (assert) => {
    assert.equal(titlecase('firstName'), 'First Name');
  });

  test('Titlecase a under_scored string', (assert) => {
    assert.equal(titlecase('first_name'), 'First Name');
  });

  test('Titlecase a dash-erized string', (assert) => {
    assert.equal(titlecase('first-name'), 'First Name');
  });

  test('Titlecase a space seperated string', (assert) => {
    assert.equal(titlecase('first name'), 'First Name');
  });
});
