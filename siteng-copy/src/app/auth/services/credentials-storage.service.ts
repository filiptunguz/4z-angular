import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

/**
 * This interface is implemented in SSR too
 * so its methods are safe to be called without isPlatformServer
 */
export interface CredentialsStorageInterface {
  // clearCookies(): void;
  //
  // getApiKey(): string | undefined;
  //
  // getExitImpersonationLink(): string;
  //
  // getImpersonatedEmail(): string | undefined;

  hasApiKey(): boolean;
  //
  // hasImpersonatedEmail(): boolean;
  //
  // getDeviceId(): string | undefined;
  //
  // setDeviceId(): void;
  //
  // hasDeviceId(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CredentialsStorageService implements CredentialsStorageInterface {
  private static readonly API_KEY_LABEL = 'user-api-key';
  // private static readonly IMPERSONATED_EMAIL_LABEL = 'impersonated-user-email';
  // private static readonly DEVICE_ID_LABEL = 'device-id';

  private cookies = inject(CookieService);

  // clearCookies(): void {
  //   const cookieOptions: CookieOptions = {
  //     domain: environment.cookieDomain,
  //   };
  //   this.cookies.remove(CredentialsStorageService.API_KEY_LABEL, cookieOptions);
  //   this.cookies.remove(CredentialsStorageService.IMPERSONATED_EMAIL_LABEL, cookieOptions);
  // }
  //
  // getApiKey(): string | undefined {
  //   return this.cookies.get(CredentialsStorageService.API_KEY_LABEL);
  // }
  //
  // setApiKey(value: string) {
  //   this.cookies.put(
  //     CredentialsStorageService.API_KEY_LABEL,
  //     value,
  //     CredentialsStorageService.getCookieOptions()
  //   );
  // }
  //
  // setDeviceId(): void {
  //   const value = uuidv4();
  //   this.cookies.put(
  //     CredentialsStorageService.DEVICE_ID_LABEL,
  //     value,
  //     CredentialsStorageService.getCookieOptions('max')
  //   );
  // }
  //
  // getDeviceId(): string | undefined {
  //   return this.cookies.get(CredentialsStorageService.DEVICE_ID_LABEL);
  // }
  //
  // hasDeviceId(): boolean {
  //   return this.cookies.hasKey(CredentialsStorageService.DEVICE_ID_LABEL);
  // }
  //
  // getExitImpersonationLink(): string {
  //   return `https://api.4zida.rs/v6/users/psk/_exit?api_key=${this.getApiKey()}`;
  // }
  //
  // getImpersonatedEmail(): string | undefined {
  //   return this.cookies.get(CredentialsStorageService.IMPERSONATED_EMAIL_LABEL);
  // }

  hasApiKey(): boolean {
    return this.cookies.hasKey(CredentialsStorageService.API_KEY_LABEL);
  }

  // hasImpersonatedEmail(): boolean {
  //   return this.cookies.hasKey(CredentialsStorageService.IMPERSONATED_EMAIL_LABEL);
  // }
  //
  // private static getCookieOptions(expires: 'max' | null = null): CookieOptions {
  //   const exp = new Date();
  //
  //   switch (expires) {
  //     case 'max':
  //       exp.setFullYear(exp.getFullYear() + 10);
  //       break;
  //     default:
  //       exp.setDate(exp.getDate() + 7);
  //   }
  //
  //   return {
  //     expires: exp,
  //     domain: environment.cookieDomain,
  //     secure: true,
  //   };
  // }
}
