import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Replay the last event to new subscribers
  private workCompletedSource = new ReplaySubject<void>(1);
  workCompleted$ = this.workCompletedSource.asObservable();

  notifyWorkDone() {
    console.log('[SharedService] work completed event emitted');
    this.workCompletedSource.next();
  }
}
