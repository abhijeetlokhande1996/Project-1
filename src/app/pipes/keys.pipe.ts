import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "keys",
})
export class KeysPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      return Object.keys(value);
    }
  }
}
