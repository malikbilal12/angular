import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://justvoteit.de/demo/sheild_api/api';

  constructor(private http: HttpClient) { }

  getData(uuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/isValidQRCode?uuid=${uuid}`);
  }

  textMessage(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/sendNotification`, JSON.stringify(formData), { headers });
  }
}
