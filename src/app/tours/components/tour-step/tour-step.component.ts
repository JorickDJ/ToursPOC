import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { TourStep } from '../../models';
import { TourStepEvent, ContentPosition } from '../../types';

@Component({
  selector: 'tour-step',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss']
})
export class TourStepComponent implements OnDestroy {

  interaction$: Subject<TourStepEvent> = new Subject();
  destroyed$: Subject<void> = new Subject();

  currentStep: number;
  finished: boolean;
  step: TourStep;
  position: ContentPosition = 'right';

  constructor(private elementRef: ElementRef) { }

  get element(): ElementRef {
    return this.elementRef;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
