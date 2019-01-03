import { getOwner } from '@ember/application';
import { initialize as initializeI18n } from 'dummy/initializers/ember-form-for-i18n';

export default function registerI18n(testingContext, object) {
  testingContext.registry.register('service:i18n', object);
  initializeI18n(getOwner(testingContext));
}
