import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpContext} from "@angular/common/http";
import {SavedSearch} from "./saved-search-list.context";
import {map, Observable} from "rxjs";
import {SEND_CREDENTIALS} from "../../auth/api-key.interceptor";
import {SpecificSearchFilter} from "../../search/search-filters/search-filter";
import {SavedSearchDetailsSavedSearch} from "./saved-search-details.context";

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getMyCollection(limit: null|number = null):Observable<SavedSearch[]> {
    const endpoint = limit
      ? `${this.baseUrl}/saved-search/me?limit=${limit}`
      : `${this.baseUrl}/saved-search/me`;
    const context = new HttpContext().set(SEND_CREDENTIALS, true);

    return this.http.get<SavedSearch[]>(endpoint, {context})
      .pipe(
        map(savedSearches => savedSearches.map(search => SavedSearch.newInstance(search)))
      )
  }

  add(searchFilter: SpecificSearchFilter): Observable<SavedSearchDetailsSavedSearch> {
    let params = searchFilter as any;
    delete params.type;
    const context = new HttpContext().set(SEND_CREDENTIALS, true);
    return this.http.post<SavedSearchDetailsSavedSearch>(`${this.baseUrl}${searchFilter.savedSearchEndpoint}`, params, {context});
  }

  rename(id: string, newTitle: string): Observable<SavedSearchDetailsSavedSearch> {
    const context = new HttpContext().set(SEND_CREDENTIALS, true);
    return this.http.patch<SavedSearchDetailsSavedSearch>(
      `${this.baseUrl}/saved-search/${id}`,
      {title: newTitle},
      {context}
      ).pipe(
        map(SavedSearchDetailsSavedSearch.newInstance)
    );
  }

  get(id: string): Observable<SavedSearchDetailsSavedSearch> {
    return this.http.get<SavedSearchDetailsSavedSearch>(`${this.baseUrl}/saved-search/${id}`)
      .pipe(map(SavedSearchDetailsSavedSearch.newInstance));
  }
}
