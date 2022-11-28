import {Injectable} from '@angular/core';
import {HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CredentialsStorageService} from "./services/credentials-storage.service";

export const SEND_CREDENTIALS = new HttpContextToken(() => false);

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor(private credentialsStorage: CredentialsStorageService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.credentialsStorage.hasApiKey()
      && request.context.get(SEND_CREDENTIALS)) {
      const headers: any = {
        'X-API-Key': String(this.credentialsStorage.getApiKey())
      };
      if (this.credentialsStorage.hasImpersonatedEmail()) {
        headers['X-Switch-User'] = this.credentialsStorage.getImpersonatedEmail();
      }
      request = request.clone({
        setHeaders: headers
      });
    }

    return next.handle(request);
  }
}
