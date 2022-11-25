import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Params, Router, UrlSerializer} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
// import { AdSearchResults } from './search.context';
// import { PlaceService } from './place.service';
// import { SearchFilter, SpecificSearchFilter } from './search-filters/search-filter';
// import { PremiumListAd } from '../ad/premium-list.context';
import {AdSearchResults} from "./search.context";
import {SearchFilter, SpecificSearchFilter} from "./search-filters/search-filter";
import {PlaceService} from "./place.service";

export interface RouteAndParams {
  route: string;
  queryParams: Params;
}

export interface RoutePlaceAware {
  placeIds?: number[];
  newBuilding?: boolean;

  get route(): string;

  toQueryParams(): Params;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  http = inject(HttpClient);
  placesService = inject(PlaceService);
  serializer = inject(UrlSerializer);
  router = inject(Router);

  baseUrl = 'https://api.4zida.rs/v6';

  /**
   * Detects if the current URL has placeSlugs
   * and normalizes them into an array
   * whether they're found in the route or in the query params
   */
  static snapshotToPlaceSlugs(snapshot: ActivatedRouteSnapshot): string[] {
    if (snapshot.paramMap.has('placeSlug')) {
      let place = snapshot.queryParamMap.getAll('mesto');
      let slugs = snapshot.paramMap.get('placeSlug');
      if (slugs) {
        if (place) {
          return [slugs, ...place];
        }
        return [...slugs];
      }
    }
    return [];
  }

  snapshotToFilter(snapshot: ActivatedRouteSnapshot): Observable<SpecificSearchFilter> {
    const filter = SearchFilter.fromSnapshot(snapshot);
    const slugs = SearchService.snapshotToPlaceSlugs(snapshot);
    if (slugs.length === 0) {
      return of(filter);
    }

    return this.placesService.getIdsBySlugs(slugs).pipe(
      map(placeIds => {
        filter.placeIds = placeIds;
        return filter;
      })
    );
  }

  filterToHomstersUrl(queryParams: Params): any {
    if (queryParams.hasOwnProperty('newBuilding')) {
      delete queryParams['newBuilding'];
    }
    const urlTree = this.router.createUrlTree([`novogradnja/projekti`], {
      queryParams: queryParams,
    });
    return 'https://www.4zida.rs' + this.serializer.serialize(urlTree);
  }

  filterToRouteAndParams(adSearchFilter: RoutePlaceAware): Observable<RouteAndParams> {
    let route = adSearchFilter.route;
    const queryParams = adSearchFilter.toQueryParams();
    if (adSearchFilter.newBuilding === true) {
      route = '/novogradnja/projekti';
      return of({
        route,
        queryParams,
      });
    }

    if (adSearchFilter.placeIds && adSearchFilter.placeIds.length > 0) {
      return this.placesService.getSlugsByIds(adSearchFilter.placeIds).pipe(
        map(slugs => {
          /**
           * For some reason unknown to me, if you modify the value passed in through `map` in place (without making a copy)
           * a subsequent call actually gets the modified value (as it happens in SSR, when this observable gets called 2x -
           * - once on the server and once in the browser)
           */
          const slugsCopy = slugs.slice();
          route = route + '/' + slugsCopy.shift();
          if (slugsCopy.length > 0) {
            queryParams['mesto'] = slugsCopy;
          }

          // Repeat this magic for structures as well
          if (queryParams['struktura'] && queryParams['struktura'].length > 0) {
            const structuresCopy = queryParams['struktura'].slice();
            route = route + '/' + structuresCopy.shift();
            if (structuresCopy.length > 0) {
              queryParams['struktura'] = structuresCopy;
            } else {
              delete queryParams['struktura'];
            }
          }

          return {
            route,
            queryParams,
          };
        })
      );
    } else {
      return of({
        route,
        queryParams,
      });
    }
  }

  search(filter: SpecificSearchFilter): Observable<AdSearchResults> {
    let options = { params: filter.toHttpParams() };

    if (options.params.get('page')) {
      options.params = options.params.delete('type');
    }

    return this.http
      .get<AdSearchResults>(`${this.baseUrl}${filter.endpoint}`, options)
      .pipe(map(AdSearchResults.newInstance));
  }

  // premiumSearch(filter: SpecificSearchFilter | null): Observable<PremiumListAd[]> {
  //   let params = filter ? filter.toPremiumHttpParams() : new HttpParams();
  //
  //   if (isPlatformServer(this.platformId)) params = params.append('showPerPage', '10');
  //
  //   return this.http
  //     .get<PremiumListAd[]>(`${this.baseUrl}/premium`, { params })
  //     .pipe(map((results: PremiumListAd[]) => results.map(PremiumListAd.newInstance)));
  // }
}
