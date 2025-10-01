import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private _loading = new BehaviorSubject<boolean>(false);

  loading$ = this._loading.asObservable();

  show() {
    this.loadingCount++;
    this._loading.next(true);
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this._loading.next(false);
    }
  }
}
