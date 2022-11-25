import {UrlMatchResult, UrlSegment} from '@angular/router';

export const PATTERN: RegExp = /(prodaja|izdavanje)-(stanova|kuca|poslovnih-prostora|placeva|garaza-i-parkinga)/m;

export function SearchUrlMatcher(urlSegments: UrlSegment[]): UrlMatchResult | null {
  if (urlSegments.length === 1 || urlSegments.length === 2 || urlSegments.length === 3) {
    if (PATTERN.test(urlSegments[0].path)) {
      if (urlSegments.length === 2) {
        return {consumed: urlSegments, posParams: {placeSlug: urlSegments[1]}};
      }
      if (urlSegments.length === 3) {
        return {consumed: urlSegments, posParams: {placeSlug: urlSegments[1], structure: urlSegments[2]}};
      }
      return {consumed: urlSegments};
    }
  }
  return null;
}
