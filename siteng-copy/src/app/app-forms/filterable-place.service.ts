import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpContext, HttpContextToken, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {PlaceSuggestion} from "./place-suggestion";

const SEND_CREDENTIALS = new HttpContextToken(() => true);

@Injectable({
  providedIn: 'root'
})
export class FilterablePlaceService {
  static readonly BASE_URL = environment.baseUrl;

  private static customComparator(first: PlaceSuggestion, second: PlaceSuggestion): number {
    if (first.inCity && !second.inCity) {
      return -1;
    }
    if (!first.inCity && second.inCity) {
      return 1;
    }
    if (first.depth === second.depth) {
      return first.label.localeCompare(second.label, 'sr-Latn-RS');
    }

    return first.depth > second.depth ? 1 : -1;
  }

  private anonymousContext = new HttpContext().set(SEND_CREDENTIALS, false);

  constructor(private http: HttpClient) {
  }

  getById(id: number): Observable<PlaceSuggestion | null> {
    return this.filterByIds([id])
      .pipe(
        map(suggestions => suggestions?.length ? suggestions[0] : null)
      );
  }

  filterByIds(ids: number[]): Observable<PlaceSuggestion[] | null> {
    let params = new HttpParams();
    ids.map(id => {
      params = params.append('ids[]', id.toString());
    });

    return this.http.get<PlaceSuggestion[]>(`${FilterablePlaceService.BASE_URL}/autocomplete`, {
      params,
      context: this.anonymousContext
    })
      .pipe(
        map(suggestions => suggestions.map(PlaceSuggestion.newInstance))
      );
  }

  filterByTerm(term: string, withAds: boolean = false, excludedIds: number[] = []): Observable<PlaceSuggestion[]> {
    let params = new HttpParams().set('q', term.toLocaleLowerCase());
    if (withAds) {
      params = params.set('withAds', '1');
    }

    return this.http.get<PlaceSuggestion[]>(`${FilterablePlaceService.BASE_URL}/autocomplete`, {
      params,
      context: this.anonymousContext
    })
      .pipe(
        map(suggestions => suggestions.map(PlaceSuggestion.newInstance)),
        map(suggestions => suggestions.filter(suggestion => !excludedIds.includes(suggestion.id))),
        map(suggestions => suggestions.sort(FilterablePlaceService.customComparator))
      );
  }
}
