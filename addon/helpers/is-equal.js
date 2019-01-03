import { helper } from '@ember/component/helper';
import isEqual from '../utils/is-equal';

export default helper(([a, b]) => isEqual(a, b));
