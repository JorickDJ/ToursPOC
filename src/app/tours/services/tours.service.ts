import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { TourStepComponent } from '../components/tour-step/tour-step.component';
import { DOCUMENT } from '@angular/common';
import { startWith, takeUntil } from 'rxjs/operators';
import { TourOutletComponent } from '../components/tours-outlet/tours-outlet.component';

import { ElementOffset, TourStep } from '../models';
import { ContentPosition, TourStepEvent } from '../types';

export interface TourConfig {
  steps?: TourStep[];
}

const CONTENT_WIDTH = 240;

@Injectable()
export class ToursService {

  private currentStep = -1;
  private steps: TourStep[] = [];
  private portalHost: DomPortalOutlet;
  private started: boolean;
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  startTour({ steps }: TourConfig): void {
    this.steps = steps;
    if (!this.started) {
      this.started = true;
      const component = this.buildOverlay();
      const { interaction$, destroyed$ } = component;
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
        component.currentStep = this.currentStep;
        component.finished = this.currentStep + 1 >= this.steps.length;
        if (step) {
          const element = this.getElement(step.step);
          if (element) {
            component.step = step;
            component.position = this.calculateContentPosition(element);
            this.updateStep(element, component.element.nativeElement);
            if (!this.isInViewPort(element)) {
              setTimeout(() => {
                window.scrollTo({
                  top: this.getOffset(element).top - 15,
                  behavior: 'smooth'
                });
              }, 0);
            }
          }
        } else {
          interaction$.next('next');
        }
      });
    } else {
      this.stopTour();
    }
  }

  private buildOverlay(): TourStepComponent {
    if (this.portalHost) {
      this.portalHost.detach();
    }

    this.portalHost = new DomPortalOutlet(
      this.document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector);

    const portalRef = this.portalHost.attach(new ComponentPortal(TourOutletComponent));
    return portalRef.instance.step;
  }

  private getNextStep(): TourStep {
    const stepIndex = this.currentStep;
    if (stepIndex > -1 && stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      return step;
    }

    return null;
  }

  private isInViewPort(element: HTMLElement): boolean {
    const { top, height } = this.getOffset(element);
    const { scrollY, innerHeight } = window;
    return top >= scrollY && top + height <= innerHeight + scrollY;
  }

  private getOffset(element: HTMLElement): ElementOffset {
    const { left, top, width, height } = element.getBoundingClientRect();
    return {
      left: left + window.scrollX,
      top: top + window.scrollY,
      width,
      height
    };
  }

  private calculateContentPosition(element: HTMLElement): ContentPosition {
    const { x, width } = element.getBoundingClientRect();
    const { innerWidth } = window;
    if (x + width > innerWidth - CONTENT_WIDTH) {
      return 'left';
    }
    return 'right';
  }

  private updateStep(step: HTMLElement, element: any): void {
    if (step) {
      const { left, top, width, height } = this.getOffset(step);
      this.renderer.setStyle(element, 'width', `${width}px`);
      this.renderer.setStyle(element, 'height', `${height}px`);
      this.renderer.setStyle(element, 'transform', `translate(${left}px, ${top}px)`);
    }
  }

  private getElement(stepName: string): HTMLElement {
    const element = this.document.getElementById(stepName) as HTMLElement;
    return element ?? null;
  }

  private stopTour(): void {
    this.portalHost.detach();
    this.portalHost = null;
    this.started = false;
    this.currentStep = -1;
    this.steps = [];
  }
}
