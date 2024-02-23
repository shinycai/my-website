import {
  renderFieldType,
  createForm,
} from '../../scripts/units.js';

/**
 * decorates the form
 * @param {Element} block The form block element
 */
export default async function decorate(block) {
  // define field list
  [...block.querySelectorAll(':scope table')].forEach((table, index) => {
    table.classList.add('form-field-group');
    let fiedlGroupType = '';
    let fiedlGroupName = '';

    if (index === 0) {
      fiedlGroupType = 'radio';
    } else {
      fiedlGroupType = 'checkbox';
    }

    table.classList.add(`field-group-type-${fiedlGroupType}`);
    table.setAttribute('field-group-type', `${fiedlGroupType}`);

    switch (index) {
      case 0:
        fiedlGroupName = 'age';
        break;
      case 1:
        fiedlGroupName = 'disease';
        break;
      default:
        break;
    }
    table.setAttribute('field-group-name', `${fiedlGroupName}`);

    table.querySelectorAll(':scope > tbody > tr > td').forEach((field, _index) => {
      const type = field.closest('table').getAttribute('field-group-type');
      const name = field.closest('table').getAttribute('field-group-name');
      let value = _index;
      if (name === 'disease' && _index === field.closest('table > tbody').children.length - 1) {
        value = 'noCondition';
      }
      renderFieldType(field, type, name, value, `${name}-${_index}`);
      field.classList.add('field-item');
      field.classList.add(`field-${type}-item`);
    });
  });

  // create form
  createForm(block);

  // define submit button
  const form = block.querySelector(':scope form');
  const content = form.querySelectorAll(':scope >div');
  const submitBtn = content[2].querySelector('u');
  submitBtn.classList.add('button', 'primary', 'button-submit');
}
