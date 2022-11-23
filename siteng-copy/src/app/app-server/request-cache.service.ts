import {Inject, Injectable} from '@angular/core';
import * as NodeCache from "node-cache";
import {HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";

export const NODE_CACHE = 'NODE_CACHE';

export interface Entry {
  url: string;
  ttl: number | undefined;
}

/**
 * @see https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/request-cache.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  constructor(@Inject(NODE_CACHE) private nodeCache: NodeCache) {
  }

  private static getTtl(headers: HttpHeaders): number | null {
    const cacheControl = headers.get('cache-control');
    if (headers.has('cache-control')) {
      // Only public responses are cached
      if (cacheControl && cacheControl.includes('public')) {
        const regex = /s-maxage=([0-9]+)/m;
        const matches = cacheControl.match(regex);
        // Only responses with s-maxage are cached
        if (matches && matches.length === 2) {
          const sMaxAge = Number(matches[1]);
          // Varnish exposes `Age` in VPN
          if (headers.has('age')) {
            const age = Number(headers.get(('age')));
            return sMaxAge - age;
          }

          return sMaxAge;
        }
      }
    }

    return null;
  }

  get(request: HttpRequest<unknown>): HttpResponse<unknown> | undefined {
    return this.nodeCache.get<HttpResponse<unknown>>(request.urlWithParams);
  }

  put(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const ttl = RequestCacheService.getTtl(response.headers);
    if (ttl) {
      this.nodeCache.set(request.urlWithParams, response, ttl);
    }
  }

  getEntries(): Entry[] {
    return this.nodeCache.keys().map(key => ({ url: key, ttl: this.nodeCache.getTtl(key) }));
  }
}
