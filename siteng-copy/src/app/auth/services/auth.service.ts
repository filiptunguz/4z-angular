import {inject, Injectable} from '@angular/core';
import {CredentialsStorageService} from "./credentials-storage.service";
import {HttpClient, HttpContext, HttpContextToken} from "@angular/common/http";
import {map, tap} from "rxjs";
import {User} from "../me.context";
import {environment} from "../../../environments/environment";
import {NotifierService} from "../../misc/notifier/notifier.service";
import {StateService} from "../../shared/services/state.service";

export const SEND_CREDENTIALS = new HttpContextToken(() => false);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  credentialsStorage = inject(CredentialsStorageService);
  http = inject(HttpClient);
  notifier = inject(NotifierService);
  stateService = inject(StateService);

  private static readonly BASE_URL = environment.baseUrl;

  user$ = this.stateService.user$;

  loadUserFromApiKey(): void {
    if (this.credentialsStorage.hasApiKey()) {
      const context = new HttpContext().set(SEND_CREDENTIALS, true);
      this.http
        .get<User>(`${AuthService.BASE_URL}/users/me`, { context })
        .pipe(
          map(data => User.newInstance(data)),
          tap((user: User) => {
            if (user.isHomeLoanBuyer()) this.notifier.trigger(NotifierService.KEY_KNOWLEDGE_BASE);
          })
          // tap((user: User) => Sentry.setUser({email: user.email}))
        )
        .subscribe(user => this.stateService.setUser(user));
    }
  }
}
