import {Injectable} from '@angular/core';
import {of} from "rxjs";
import {AuthInterface} from "../auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AnonymousAuthService implements AuthInterface {
  user$ = of(null);

  logOut(): void {
  }
}
