import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { TourStep } from '../../models/tour-step.model';
import { TourStepEvent } from '../../models/tour-step-event.model';
import { Position } from '../../models/position';

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
  position: Position = 'right';

  constructor(private elementRef: ElementRef) { }

  get element(): ElementRef {
    return this.elementRef;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
