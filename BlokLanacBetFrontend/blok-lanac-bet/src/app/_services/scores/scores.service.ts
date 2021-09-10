import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const LOCALHOST_API_URL = 'http://localhost:3000';
const BASE_API_URL =
  'https://my-json-server.typicode.com/gori8/nba-results-api';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  constructor(private http: HttpClient) {}

  getGames(ids): Observable<any> {
    return this.http.get(
      `${BASE_API_URL}/games?gameId=${ids.join('&gameId=')}`
    );
  }

  getGamesForTheDay(date): Observable<any> {
    return this.http.get(`${BASE_API_URL}/games?date=${date}`);
  }
}
