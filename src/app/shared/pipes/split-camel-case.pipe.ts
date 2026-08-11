import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "splitCamelCase",
  standalone: false,
})
export class SplitCamelCasePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value || value.trim() === "") return value;
    return value.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
}