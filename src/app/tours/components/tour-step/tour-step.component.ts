import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TourStep } from '../../models';
import { TourStepEvent, ContentPosition } from '../../types';

@Component({
  selector: 'cal-tour-step',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss']
})
export class TourStepComponent implements OnDestroy, OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;

  interaction$: Subject<TourStepEvent> = new Subject();
  destroyed$: Subject<void> = new Subject();
  position$: BehaviorSubject<ContentPosition> = new BehaviorSubject('right');
  nextStep$: BehaviorSubject<HTMLElement> = new BehaviorSubject(null);

  currentStep: number;
  totalSteps: number;
  finished: boolean;
  step: TourStep;

  get element(): ElementRef<HTMLElement> {
    return this.elementRef;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.nextStep$.pipe(
      filter(x => !!x),
      takeUntil(this.destroyed$)
    ).subscribe(element => {
      this.position$.next(this.calculateContentPosition(element));
    });
  }

  private calculateContentPosition(element: HTMLElement): ContentPosition {
    const { x, width } = element.getBoundingClientRect();
    const { width: contentWidth } = this.content.nativeElement.getBoundingClientRect();
    const { innerWidth } = window;
    if (x + width > innerWidth - contentWidth) {
      return 'left';
    }
    return 'right';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
