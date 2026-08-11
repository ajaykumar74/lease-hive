import { Directive, ElementRef, HostListener, Input, Optional, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputFormat]',
  standalone: true
})
export class InputFormatDirective implements OnInit {

  @Input('inputFormat') formatType!: string;

  private rules: string[] = []; // ✅ precompiled rules

constructor(
  private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
  @Optional() @Self() private ngControl: NgControl
) {}

  // ✅ PERFORMANCE: SPLIT ONLY ONCE
  ngOnInit() {
    this.rules = this.formatType?.split('|') ?? [];
  }

  private formatValue(value: string, isBlur = false): string {
    let newValue = value;

    for (let rule of this.rules) {

      // --- ARGUMENT RULES ---
      const [ruleName, arg] = rule.split(':');

      switch (ruleName) {

        // --- BASIC CLEANING ---
        case 'trim':
          if (isBlur) newValue = newValue.trim();
          break;

        case 'noWhitespace':
          newValue = newValue.replace(/\s+/g, '');
          break;

        case 'singleWhitespace':
          newValue = newValue.replace(/\s+/g, ' ');
          break;

        // --- CHARACTER SET RULES ---
        case 'number':
          newValue = newValue.replace(/[^0-9]/g, '');
          break;

        case 'alpha':
          newValue = newValue.replace(/[^a-zA-Z]/g, '');
          break;

        // ✔ ALPHANUMERIC WITHOUT SPACE
        case 'alphanumeric':
          newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
          break;

        // ⭐ NEW: ALPHANUMERIC WITH SPACE
        case 'alphanumericWithSpace':
          newValue = newValue.replace(/[^a-zA-Z0-9 ]/g, '');
          break;

        case 'emailSafe':
          // letters, digits, . _ % + -
          newValue = newValue.replace(/[^a-zA-Z0-9._%+-]/g, '');
          break;

        // --- CASE TRANSFORMATION ---
        case 'upper':
          newValue = newValue.toUpperCase();
          break;

        case 'lower':
          newValue = newValue.toLowerCase();
          break;

        // --- NUMERIC TYPES ---
        case 'integer':
          newValue = newValue.replace(/[^0-9]/g, '');
          break;

        case 'signed':
          newValue = newValue.replace(/[^0-9-]/g, '');
          break;

        case 'decimal':
          newValue = newValue.replace(/[^0-9.,]/g, '');
          break;

        // --- LENGTH RULES ---
        case 'max':
          if (arg && newValue.length > +arg) {
            newValue = newValue.substring(0, +arg);
          }
          break;

        case 'min':
          // do nothing during typing — validation handles this
          break;

        case 'length':
          if (arg) {
            newValue = newValue.substring(0, +arg);
          }
          break;

        // --- CUSTOM REGEX ---
        case 'regex':
          if (arg) {
            const reg = new RegExp(`[^${arg}]`, 'g');
            newValue = newValue.replace(reg, '');
          }
          break;
      }
    }
    return newValue;
  }


  // ✅ FORMAT WHILE TYPING (CURSOR SAFE + FAST)
  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const cursor = input.selectionStart ?? 0;

    const originalValue = input.value;
    const formattedValue = this.formatValue(originalValue, false); // ✅ NO TRIM

    if (originalValue === formattedValue) return;

    const delta = originalValue.length - formattedValue.length;
    const newCursor = Math.max(cursor - delta, 0);

    this.ngControl?.control?.setValue(formattedValue, {
      emitEvent: false,
      emitModelToViewChange: true,
      emitViewToModelChange: true
    });

    requestAnimationFrame(() => {
      input.setSelectionRange(newCursor, newCursor);
    });
  }


  // ✅ FORMAT ON BLUR (FINAL CLEANUP)
  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    const formattedValue = this.formatValue(input.value, true); // ✅ TRIM HERE

    this.ngControl?.control?.setValue(formattedValue, {
      emitEvent: true,
      emitModelToViewChange: true,
      emitViewToModelChange: true
    });
  }


  // ✅ OPTIONAL: Mobile / IME safety (recommended)
  @HostListener('compositionend')
  onCompositionEnd() {
    this.onInput();
  }
}
