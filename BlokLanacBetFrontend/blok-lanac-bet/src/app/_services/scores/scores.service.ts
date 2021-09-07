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

  getGames(): Observable<any> {
    return this.http.get(`${BASE_API_URL}/games`);
  }

  addBet(bet: any): Observable<any> {
    return this.http.post(`${LOCALHOST_API_URL}/bets`, bet);
  }

  changeBetStatus(bet): Observable<any> {
    return this.http.put(`${LOCALHOST_API_URL}/bets/${bet.id}`, bet);
  }

  getAllUserBets(gamblerAddress): Observable<any> {
    return this.http.get(
      `${LOCALHOST_API_URL}/bets?eth_address_like=${gamblerAddress}`
    );
  }

  getBetById(id): Observable<any> {
    return this.http.get(`${LOCALHOST_API_URL}/bets/${id}`);
  }
}
