import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_API_URL =
  'https://my-json-server.typicode.com/gori8/nba-results-api';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  constructor(private http: HttpClient) {}

  getGames(): Observable<any> {
    return this.http.get(`${BASE_API_URL}/games`);
  }
}
