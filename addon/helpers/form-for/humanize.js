import { helper } from '@ember/component/helper';
import { humanize } from '../../utils/strings';

export function formForHumanize([string]) {
  return humanize(string);
}

export default helper(formForHumanize);
