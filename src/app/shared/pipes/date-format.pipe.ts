import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateFormat",
  standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value == undefined) {
      return "";
    }
    else {
      var dt = new Date(value);
      if (dt.getFullYear() == 1) {
        return "NA";
      }
      else {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(dt, 'dd-MMM-yyyy HH:mm:ss');
      }
    }


  }
} 

@Pipe({
  name: "remainingDays",
  standalone: false
})
export class RemainingDaysPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) {
      return "";
    }

    const targetDate = new Date(value);
    const today = new Date();

    // Clear time for accurate day diff
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return "0d";
    }

    if (diffDays < 30) {
      return `${diffDays}d`;
    }

    const months = Math.floor(diffDays / 30);
    return `${months}m`;
  }
}