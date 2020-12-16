import { ComponentRef, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TourStepComponent } from '../components/tour-step/tour-step.component';
import { DOCUMENT } from '@angular/common';
import { startWith, takeUntil} from 'rxjs/operators';
import { TourStep } from '../models/tour-step.model';
import { TourStepEvent } from '../models/tour-step-event.model';
import { Position } from '../models/position';

export interface TourConfig {
  steps?: TourStep[];
}

const CONTENT_WIDTH = 240;

@Injectable({
  providedIn: 'root',
})
export class ToursService {

  private currentStep = -1;
  private steps: TourStep[] = [];
  private overlay: OverlayRef;
  private started: boolean;
  private renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document, private overlayService: Overlay, private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  startTour({ steps }: TourConfig): void {
    this.steps = steps;
    if (!this.started) {
      this.started = true;
      const component = this.buildOverlay();
      const { interaction$, destroyed$ } = component.instance;
      interaction$.pipe(
        takeUntil(destroyed$),
        startWith('next')
      ).subscribe((event: TourStepEvent) => {
        if (event === 'next') {
          this.currentStep++;
        }
        else if (event === 'previous') {
          this.currentStep--;
        }
        else {
          this.stopTour();
          return;
        }

        const step = this.getNextStep();
        component.instance.currentStep = this.currentStep;
        component.instance.finished = this.currentStep + 1 >= this.steps.length;
        if (step) {
          const element = this.getElement(step.step);
          if (element) {
            component.instance.step = step;
            component.instance.position = this.calculatePosition(element);
            this.updateStep(element, component.instance.element.nativeElement);
          }
        }
      });
    } else {
      this.stopTour();
    }
  }

  private buildOverlay(): ComponentRef<TourStepComponent> {
    if (this.overlay) {
      this.overlay.detach();
    }

    this.overlay = this.overlayService.create();
    const tourStep = new ComponentPortal(TourStepComponent);
    const component = this.overlay.attach(tourStep);
    return component;
  }

  private getNextStep(back?: boolean): TourStep {
    const stepIndex = this.currentStep;
    if (stepIndex > -1 && stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      return step;
    }

    return null;
  }

  private updateStep(step: HTMLElement, element: any): void {
    if (step) {
      const {x, y, width, height } = step.getBoundingClientRect();
      this.renderer.setStyle(element, 'width', `${width}px`);
      this.renderer.setStyle(element, 'height', `${height}px`);
      this.renderer.setStyle(element, 'transform', `translate(${x}px, ${y}px)`);
    }
  }

  private getElement(stepName: string): HTMLElement {
    const element = this.document.getElementById(stepName) as HTMLElement;
    return element ?? null;
  }

  private calculatePosition(element: HTMLElement): Position {
    const { x, width } = element.getBoundingClientRect();
    const { innerWidth } = window;
    if (x + width > innerWidth - CONTENT_WIDTH) {
      return 'left';
    }
    return 'right';
  }

  private stopTour(): void {
    this.overlay.detach();
    this.overlay = null;
    this.started = false;
    this.currentStep = -1;
    this.steps = [];
  }
}
