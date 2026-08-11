import { Injectable } from '@angular/core';
import { DateUtility } from './date-utility.service';
import { StringUtility } from './string-utility.service';
import { LogFormErrorsUtility } from './log-form-errors-utility.service';

import { NumberUtility } from './number-utility.service';

@Injectable({ providedIn: 'root' })

export class AppUtilityService {
  constructor(
    public date: DateUtility,
    public string: StringUtility,
    public number: NumberUtility,
    public LogFormErrors: LogFormErrorsUtility,
  ) { }
}
