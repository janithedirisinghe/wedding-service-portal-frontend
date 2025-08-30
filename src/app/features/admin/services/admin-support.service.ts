import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportDTO } from '../../customer/models/support.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSupportService {
  private apiUrl = 'http://localhost:8080/api/supports';

  constructor(private http: HttpClient) { }

  getAllSupports(): Observable<SupportDTO[]> {
    return this.http.get<SupportDTO[]>(this.apiUrl);
  }

  getSupportById(id: number): Observable<SupportDTO> {
    return this.http.get<SupportDTO>(`${this.apiUrl}/${id}`);
  }

  getSupportsBySeverity(severity: string): Observable<SupportDTO[]> {
    return this.http.get<SupportDTO[]>(`${this.apiUrl}/severity/${severity}`);
  }

  updateSupport(id: number, supportDTO: SupportDTO): Observable<SupportDTO> {
    return this.http.put<SupportDTO>(`${this.apiUrl}/${id}`, supportDTO);
  }
}
