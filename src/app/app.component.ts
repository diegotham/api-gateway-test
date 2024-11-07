import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { ConnectPageComponent } from './pages/connect-page.component';
import { ConnectStore } from './state/connect.store';

@Component({
  standalone: true,
  imports: [ConnectComponent, RouterModule, ConnectPageComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly connectStore = inject(ConnectStore);

  ngOnInit() {
    this.connectStore.login();
    this.connectStore.fetchClients();
    this.connectStore.fetchConnections();
  }

  selectClient(clientId: number) {
    this.connectStore.selectClient(clientId);
  }

  reloadConnections() {
    this.connectStore.fetchConnections();
  }
}
