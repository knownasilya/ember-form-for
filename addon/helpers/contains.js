import { helper } from '@ember/component/helper';
import { isArray, A as emberArray } from '@ember/array';

export function contains([haystack, needle]) {
  if (isArray(haystack)) {
    return emberArray(haystack).includes(needle);
  } else {
    return haystack === needle;
  }
}

export default helper(contains);
