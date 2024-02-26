import {
  renderFieldType,
  createForm,
  getFieldValue,
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

    // define field type of each table
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
      const value = _index;
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

  submitBtn.addEventListener('click', () => {
    const result = getFieldValue(['age', 'disease']);
    console.log(result);
  });
}
