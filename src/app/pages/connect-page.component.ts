import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectComponent } from '../connect/connect.component';
import { QuestionService } from '../forms/question.service';
import { ConnectStore } from '../state/connect.store';

@Component({
  standalone: true,
  selector: 'app-connect-client-page',
  template: `
    @if (connectStore.clientSelected()?.name) {
    <div>
      <h3>Connect with: {{ connectStore.clientSelected()?.name }}</h3>
      <app-connect [questions]="connectStore.formQuestions()"></app-connect>
    </div>
    }
  `,
  providers: [QuestionService],
  imports: [AsyncPipe, ConnectComponent],
})
export class ConnectPageComponent {
  readonly qs = inject(QuestionService);
  readonly connectStore = inject(ConnectStore);
}
