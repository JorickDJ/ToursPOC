import { ComponentRef, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TourStepComponent } from '../components/tour-step/tour-step.component';
import { DOCUMENT } from '@angular/common';
import { startWith, takeUntil} from 'rxjs/operators';

export interface TourConfig {
  steps?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ToursService {

  private currentStep = 0;
  private steps: any[] = [];
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
      const { next$, finish$, previous$, destroyed$ } = component.instance;
      next$.pipe(
        takeUntil(destroyed$),
        startWith(undefined as void)
      ).subscribe(() => {
        component.instance.currentStep = this.currentStep;
        const step = this.getNextStep();
        if (step) {
          this.updateStep(step, component.instance.element.nativeElement);
        }
        component.instance.finished = this.currentStep >= this.steps.length;
      });

      finish$.subscribe(() => this.stopTour());
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

  private getNextStep(back?: boolean): HTMLElement {
    const stepIndex = this.currentStep;
    if (stepIndex > -1 && stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      this.currentStep++;
      return this.document.getElementById(step) as HTMLElement;
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

  private stopTour(): void {
    this.overlay.detach();
    this.overlay = null;
    this.started = false;
    this.currentStep = 0;
    this.steps = [];
  }
}
