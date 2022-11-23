import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../../../environments/environment";

@Pipe({
  name: 'cdn',
  standalone: true
})
export class CdnPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    return `${environment.cdnUrl}${value}`;
  }
}
