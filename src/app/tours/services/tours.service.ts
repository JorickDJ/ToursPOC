import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { TourStepComponent } from '../components/tour-step/tour-step.component';
import { DOCUMENT } from '@angular/common';
import { startWith, takeUntil } from 'rxjs/operators';
import { TourStep } from '../models/tour-step.model';
import { TourStepEvent } from '../models/tour-step-event.model';
import { ContentPosition } from '../models/content-position';
import { TourOutletComponent } from '../components/tours-outlet/tours-outlet.component';

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
            component.position = this.calculatePosition(element);
            this.updateStep(element, component.element.nativeElement);
            this.scrollToElement(element);
          }
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

  private scrollToElement(target: HTMLElement): void {
    const { innerHeight } = window;
    const { x, y, width, height } = target.getBoundingClientRect();
    console.log(y + height > innerHeight);
  }

  private updateStep(step: HTMLElement, element: any): void {
    if (step) {
      const { x, y, width, height } = step.getBoundingClientRect();
      this.renderer.setStyle(element, 'width', `${width}px`);
      this.renderer.setStyle(element, 'height', `${height}px`);
      this.renderer.setStyle(element, 'transform', `translate(${x}px, ${y}px)`);
    }
  }

  private getElement(stepName: string): HTMLElement {
    const element = this.document.getElementById(stepName) as HTMLElement;
    return element ?? null;
  }

  private calculatePosition(element: HTMLElement): ContentPosition {
    const { x, width } = element.getBoundingClientRect();
    const { innerWidth } = window;
    if (x + width > innerWidth - CONTENT_WIDTH) {
      return 'left';
    }
    return 'right';
  }

  private stopTour(): void {
    this.portalHost.detach();
    this.portalHost = null;
    this.started = false;
    this.currentStep = -1;
    this.steps = [];
  }
}
