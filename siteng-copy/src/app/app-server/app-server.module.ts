import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from '../app.module';
import {AppComponent} from '../app.component';
import {AuthService} from "../auth/services/auth.service";
import {AnonymousAuthService} from "./anonymous-auth.service";
import {CredentialsStorageService} from "../auth/services/credentials-storage.service";
import {EmptyCredentialsStorageService} from "./empty-credentials-storage.service";
import {UniversalModule} from "@ng-web-apis/universal";
// import {ProfilingPollService} from "../home/profiling-poll-dialog/profiling-poll.service";
// import {EmptyProfilingPollService} from "../home/profiling-poll-dialog/empty-profiling-poll.service";
// import {JsonLdService} from "../app-layout/services/json-ld.service";
// import {InteractionsService} from '../misc/services/interactions.service';
// import {EmptyInteractionsService} from '../misc/services/empty-interactions.service';
import {NotifierService} from '../misc/notifier/notifier.service';
import {EmptyNotifierService} from "./empty-notifier.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {CachingInterceptor} from "./caching-interceptor";
// import { WebVitalsService } from '../app-layout/services/web-vitals.service';
// import { EmptyWebVitalsService } from '../app-layout/services/empty-web-vitals.service';
import {CookieService} from 'ngx-cookie';
import {EmptyCookieService} from './empty-cookie.service';
// import {GemiusService} from '../misc/services/gemius.service';
// import {EmptyGemiusService} from '../misc/services/empty-gemius.service';
// import {FacebookService} from '../misc/services/facebook.service';
// import {EmptyFacebookService} from '../misc/services/empty-facebook.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    UniversalModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
    {provide: AuthService, useClass: AnonymousAuthService},
    {provide: CredentialsStorageService, useClass: EmptyCredentialsStorageService},
    // {provide: ProfilingPollService, useClass: EmptyProfilingPollService},
    // {provide: JsonLdService, useClass: JsonLdService},
    // {provide: InteractionsService, useClass: EmptyInteractionsService},
    {provide: NotifierService, useClass: EmptyNotifierService},
    // {provide: WebVitalsService, useClass: EmptyWebVitalsService},
    {provide: CookieService, useClass: EmptyCookieService},
    // {provide: GemiusService, useClass: EmptyGemiusService},
    // {provide: FacebookService, useClass: EmptyFacebookService},
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}
