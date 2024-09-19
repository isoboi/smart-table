import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient);

  getUsers(): Observable<UserInterface[]> {
    return this.httpClient.get<UserInterface[]>('/data.json');
  }
}
