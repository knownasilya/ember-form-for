import { helper } from '@ember/component/helper';

export function formForMergeCustomFormField([formFieldsHash], { name, component }) {
  formFieldsHash[name] = component;
}

export default helper(formForMergeCustomFormField);
