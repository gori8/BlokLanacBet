import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const LOCALHOST_API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class BetsService {
  constructor(private http: HttpClient) {}

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
