import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class IssueService {

  private messageSource = new BehaviorSubject('default value');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {

    this.messageSource.next(message)
  }

}