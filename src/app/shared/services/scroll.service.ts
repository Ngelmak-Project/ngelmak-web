import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private end$ = new Subject<number>();

  // Observable children can subscribe to
  endReached$ = this.end$.asObservable();

  // Emit the scrollHeight
  emitEnd(height: number) {
    this.end$.next(height);
  }
}
