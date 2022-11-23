import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {RequestCacheService} from "./request-cache.service";

/**
 * @see https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/http-interceptors/caching-interceptor.ts
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(private requestCacheService: RequestCacheService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Early exit
    if (!this.isCacheable(request)) {
      return next.handle(request);
    }

    const cachedResponse = this.requestCacheService.get(request);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(request, next);
  }

  isCacheable(request: HttpRequest<unknown>): boolean {
    return request.method === 'GET';
  }

  /**
   * Get server response observable by sending request to `next()`.
   * Will add the response to the cache on the way out.
   */
  sendRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        tap(response => {
          if (response instanceof HttpResponse && response.url) {
            this.requestCacheService.put(request, response);
          }
        })
      );
  }
}
