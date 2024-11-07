import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormQuestionComponent } from '../forms/dynamic-form-question.component';
import { QuestionBase } from '../forms/question-base';
import { QuestionControlService } from '../forms/question-control.service';
import { ConnectStore } from '../state/connect.store';

@Component({
  selector: 'app-connect',
  standalone: true,
  templateUrl: './connect.component.html',
  providers: [QuestionControlService],
  imports: [CommonModule, DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class ConnectComponent implements OnInit, OnChanges {
  readonly connectStore = inject(ConnectStore);
  private readonly qcs = inject(QuestionControlService);

  @Input() questions: QuestionBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.connectStore.formQuestions());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions']) {
      this.form = this.qcs.toFormGroup(this.connectStore.formQuestions());
    }
  }

  updateUser() {
    const user = this.form.getRawValue();
    this.connectStore.updateUser(user);
  }

  updateUserAndConnect() {
    const user = this.form.getRawValue();
    this.connectStore.updateUserAndConnect(user);
  }
}
