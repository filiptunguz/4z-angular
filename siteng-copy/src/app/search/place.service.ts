import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private http = inject(HttpClient);

  private baseUrl = environment.baseUrl;

  getIdsBySlugs(slugs: string[]): Observable<number[]> {
    const params = new HttpParams({fromObject: {slug: slugs}});

    return this.http.get<number[]>(`${this.baseUrl}/autocomplete/ids`, {params});
  }

  getSlugsByIds(ids: number[]): Observable<string[]> {
    const params = new HttpParams({fromObject: {id: ids.map(id => id + '')}});

    return this.http.get<string[]>(`${this.baseUrl}/autocomplete/slugs`, {params});
  }
}
