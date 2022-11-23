/**
 * Server only service
 * @see SeoService
 */
import {Injectable} from '@angular/core';
import {CookieOptions, ICookieService} from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class EmptyCookieService implements ICookieService {
  get(key: string): string | undefined {
    return undefined;
  }

  getAll(): object {
    return {};
  }

  getObject(key: string): object | undefined {
    return undefined;
  }

  hasKey(key: string): boolean {
    return false;
  }

  put(key: string, value: string, options?: CookieOptions): void {
  }

  putObject(key: string, value: object, options?: CookieOptions): void {
  }

  remove(key: string, options?: CookieOptions): void {
  }

  removeAll(options?: CookieOptions): void {
  }

}
