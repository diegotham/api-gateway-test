import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IClient {
  id: number;
  name: string;
  requiredFields: string[];
}

export interface IConnection {
  id: number;
  userId: number;
  clientId: number;
}

export interface IConnect {
  userId: number;
  clientId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiHost = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(`${this.apiHost}/clients`);
  }

  getConnections(): Observable<IConnection[]> {
    return this.http.get<IConnection[]>(`${this.apiHost}/connections`);
  }

  connect(connect: IConnect): Observable<IConnection> {
    return this.http.post<IConnection>(`${this.apiHost}/connections`, connect);
  }
}
