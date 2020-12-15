import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'tour-step',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss']
})
export class TourStepComponent implements OnDestroy {

  next$: Subject<void> = new Subject();
  previous$: Subject<void> = new Subject();
  finish$: Subject<void> = new Subject();
  currentStep: number;
  finished: boolean;

  destroyed$: Subject<void> = new Subject();

  constructor(private elementRef: ElementRef) { }

  get element(): ElementRef {
    return this.elementRef;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
