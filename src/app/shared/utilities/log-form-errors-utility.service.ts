import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class LogFormErrorsUtility {
  

  logFormErrors(form: FormGroup, prefix: string = ''): void {
    Object.keys(form.controls).forEach(key => {
      const control: AbstractControl = form.get(key)!;

      if (control instanceof FormGroup) {
        this.logFormErrors(control, `${prefix}${key}.`);
      } else if (control.errors) {
        console.warn(`${prefix}${key} →`, control.errors);
      }
    });
  }

}
