import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minimumAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const dob = new Date(control.value);
    const today = new Date();

    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const d = today.getDate() - dob.getDate();

    const is18OrOlder = age > minAge || (age === minAge && (m > 0 || (m === 0 && d >= 0)));

    return is18OrOlder ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
  };
}

export function emailDomainValidator(domain: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) return null;

    const domainPattern = new RegExp(`@${domain.replace('.', '\\.')}$`, 'i');
    return domainPattern.test(email) ? null : { emailDomain: { requiredDomain: domain } };
  };
}
