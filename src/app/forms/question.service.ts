import { Injectable } from '@angular/core';
import { IUser } from '../services/user.service';
import {
  DropdownQuestion,
  QuestionBase,
  TextboxQuestion,
} from './question-base';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  allQuestions(user: IUser | null): QuestionBase<string>[] {
    return [
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: user?.firstName,
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'lastName',
        label: 'Last name',
        value: user?.lastName,
        required: true,
        order: 2,
      }),
      new TextboxQuestion({
        key: 'birthDate',
        label: 'Birth date',
        value: user?.birthDate,
        required: true,
        order: 3,
      }),
      new TextboxQuestion({
        key: 'birthPlace',
        label: 'Birth place',
        value: user?.birthPlace,
        required: true,
        order: 4,
      }),
      new TextboxQuestion({
        key: 'currentAddress',
        label: 'Current address',
        value: user?.currentAddress,
        required: true,
        order: 5,
      }),
      new DropdownQuestion({
        key: 'sex',
        label: 'Sex',
        value: user?.sex,
        required: true,
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
          { key: 'other', value: 'Other' },
        ],
        order: 6,
      }),
    ];
  }
}
