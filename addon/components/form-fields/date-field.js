import { isEmpty } from '@ember/utils';
import TextField from './text-field';
import { toDateString } from '../../utils/date';

export default TextField.extend({
  control: 'one-way-date',

  serializeValue(value) {
    if (value instanceof Date) {
      return toDateString(value);
    }

    return value;
  },

  deserializeValue(value) {
    if (isEmpty(value)) {
      return null;
    }

    return new Date(value);
  }
});
