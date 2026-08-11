import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })

export class DateUtility {
  private datePipe: DatePipe = new DatePipe('en-US');

  convertJsonDateToDate(date: any): Date | null {
    if (!date) return null;
    const parsed = new Date(date);
    return parsed.getFullYear() === 1 ? null : parsed;
  }

  getJsonDate(date: any) {
    var retDate;
    var tzString = 'Asia/Kolkata';
    if (environment.envName == 'prod' || environment.envName == 'qa') {
      tzString = 'America/Los_Angeles';
    }

    if (date == null) {
      date = new Date(-8640000000000000);
    }

    if (typeof date === "string") {
      var dt = new Date(date);
      retDate = new Date(dt.toLocaleString("en-US", { timeZone: tzString }));
    }
    else {
      retDate = new Date(date.toLocaleString("en-US", { timeZone: tzString }));
    }

    var d = new Date(); // for now 
    retDate.setHours(d.getUTCHours());
    retDate.setMinutes(d.getUTCMinutes());
    retDate.setSeconds(d.getUTCSeconds());
    let formattedDate = this.datePipe.transform(retDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';

    return formattedDate;
  }

}
