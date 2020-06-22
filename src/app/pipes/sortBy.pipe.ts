import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortBy",
})
export class SortByPipe implements PipeTransform {
  transform(value: Array<{}>, fieldName: string): unknown {
    if (value) {
      return value.sort((a, b) => {
        if (a[fieldName] > b[fieldName]) {
          return 1;
        } else if (a[fieldName] < b[fieldName]) {
          return -1;
        } else {
          return 0;
        }
      });
    }
    return value;
  }
}
