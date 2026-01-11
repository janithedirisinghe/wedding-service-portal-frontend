import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerMeetingDTO } from '../models/meeting.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerMeetingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomerMeetings(userId: number): Observable<CustomerMeetingDTO[]> {
    return this.http.get<CustomerMeetingDTO[]>(`${this.apiUrl}/api/meetings/customer/${userId}`);
  }
}
