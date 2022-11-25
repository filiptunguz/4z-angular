import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwinSlideService {
  slideToSecondaryElement$ = new BehaviorSubject(0);
  slideToMainElement$ = new BehaviorSubject(0);

  slideToSecondaryElement(index: number) {
    this.slideToSecondaryElement$.next(index);
  }

  slideToMainElement(index: number) {
    this.slideToMainElement$.next(index);
  }
}
