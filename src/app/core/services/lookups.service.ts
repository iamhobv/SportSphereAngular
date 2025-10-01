import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {

  // private apiUrl = 'https://localhost:7212/api/Lookup';
  private apiUrl = `${environment.baseURL}/api/Lookup`;

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get<any>(`${this.apiUrl}/countries`);
  }

  getCities(countryId: number) {
    return this.http.get<any>(`${this.apiUrl}/cities/${countryId}`);
  }
}
