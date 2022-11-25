/**
 * Filter class holds values that correspond to reality
 * so it avoid having properties with negation (`not<something>`)
 * Form value, on the other hand, corresponds to the form UI
 * which sometimes has checkboxes (FormControls) who, when turned ON, should turn something OFF
 * and hence their property names have negation (`not<something>`)
 *
 * This method transforms from formValue.not<something> = TRUE to instance.<something> = FALSE
 */
import {upperCaseFirst} from "./string";

function setInvertedPropertyFromFormValue(instance: any, property: string, formValue: any) {
  const invertedProperty = 'not' + upperCaseFirst(property);
  if (formValue[invertedProperty] === true) {
    instance[property] = false;
  }
  if (instance.hasOwnProperty(invertedProperty)) {
    delete instance[invertedProperty];
  }
}

export function setAllInvertedBooleanPropertiesFromFormValue(instance: any, properties: string[], formValue: any) {
  properties.forEach(property => setInvertedPropertyFromFormValue(instance, property, formValue));
}

/**
 * Transforms from instance.<something> = FALSE to formValue.not<something> = TRUE
 *
 * @see setInvertedPropertyFromFormValue for detailed explanation
 */
function decorateInvertedBooleanPropertyToFormValue(instance: any, property: string, formValue: any) {
  if (instance[property] === false) {
    const invertedProperty = 'not' + upperCaseFirst(property);
    formValue[invertedProperty] = true;
  }
  if (formValue.hasOwnProperty(property)) {
    delete formValue[property];
  }
}

export function decorateAllInvertedBooleanPropertiesToFormValue(instance: any, properties: string[], formValue: any) {
  properties.forEach(property => decorateInvertedBooleanPropertyToFormValue(instance, property, formValue));
}
