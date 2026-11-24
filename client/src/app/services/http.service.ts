
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}`
    );
  }

  // POST request
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/${endpoint}`,
      body
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body
    );
  }
}
