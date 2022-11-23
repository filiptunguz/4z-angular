import {inject, Injectable} from '@angular/core';
import {CredentialsStorageService} from "./credentials-storage.service";
import {HttpClient, HttpContext, HttpContextToken, HttpHeaders} from "@angular/common/http";
import {map, tap} from "rxjs";
import {User} from "../me.context";
import {environment} from "../../../environments/environment";
import {NotifierService} from "../../misc/notifier/notifier.service";
import {StateService} from "../../shared/services/state.service";

export const SEND_CREDENTIALS = new HttpContextToken(() => false);

/**
 * This interface is implemented in SSR too
 * so its methods are safe to be called without isPlatformServer
 */
export interface AuthInterface {
  // user$: Observable<User | null>;

  logOut(): void;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentialsStorage = inject(CredentialsStorageService);
  http = inject(HttpClient);
  notifier = inject(NotifierService);
  stateService = inject(StateService);

  private static readonly BASE_URL = environment.baseUrl;
  private static readonly API_CLIENT_KEY = environment.apiClientKey;

  user$ = this.stateService.user$;

  constructor() {
    this.loadUserFromApiKey();
  }

  loadUserFromApiKey(): void {
    this.stateService.setUser(null); // TODO: fix remove this line when find solution for cookies on build:ssrf
    if (this.credentialsStorage.hasApiKey()) {
      const context = new HttpContext().set(SEND_CREDENTIALS, true);
      this.http
        .get<User>(`${AuthService.BASE_URL}/users/me`, {
          context,
          headers: new HttpHeaders({ 'X-API-Key': AuthService.API_CLIENT_KEY })
        })
        .pipe(
          map(data => User.newInstance(data)),
          tap((user: User) => {
            if (user.isHomeLoanBuyer()) this.notifier.trigger(NotifierService.KEY_KNOWLEDGE_BASE);
          }),
          // tap((user: User) => Sentry.setUser({email: user.email}))
        )
        .subscribe(user => this.stateService.setUser(user));
    }
  }
}
