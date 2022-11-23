import {Injectable} from '@angular/core';
import {CredentialsStorageInterface} from "../auth/services/credentials-storage.service";

@Injectable({
  providedIn: 'root'
})
export class EmptyCredentialsStorageService implements CredentialsStorageInterface {
  clearCookies(): void {
  }

  getApiKey(): string | undefined {
    return undefined;
  }

  getExitImpersonationLink(): string {
    return "";
  }

  getImpersonatedEmail(): string | undefined {
    return undefined;
  }

  hasApiKey(): boolean {
    return false;
  }

  hasImpersonatedEmail(): boolean {
    return false;
  }

  getDeviceId(): string | undefined {
    return undefined;
  }

  setDeviceId() {}

  hasDeviceId(): boolean {
    return false;
  }
}
