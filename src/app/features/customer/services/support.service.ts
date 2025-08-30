import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportDTO } from '../models/support.model';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private apiUrl = 'http://localhost:8080/api/supports';

  constructor(private http: HttpClient) { }

  createSupport(supportDTO: SupportDTO): Observable<SupportDTO> {
    return this.http.post<SupportDTO>(this.apiUrl, supportDTO);
  }

  getSupportsByUserId(userId: number): Observable<SupportDTO[]> {
    return this.http.get<SupportDTO[]>(`${this.apiUrl}/user/${userId}`);
  }
}
