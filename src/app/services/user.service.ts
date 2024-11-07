import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: string;
  birthPlace?: string;
  sex?: string;
  currentAddress?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiHost = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  login(): Observable<IUser> {
    return this.http
      .get<IUser[]>(`${this.apiHost}/users`)
      .pipe(map((v) => v.find((u) => u.id == 2) as IUser));
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiHost}/users`);
  }

  update(data: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiHost}/users/${data.id}`, data);
  }
}
