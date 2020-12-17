import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { TourOutletComponent } from '../components/tours-outlet/tours-outlet.component';

@Injectable({
    providedIn: 'root',
})
export class PortalService {

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    }

    startTour(): void {
        const stepComponent = new ComponentPortal(TourOutletComponent);
        const bodyPortalHost = new DomPortalOutlet(
            this.document.body,
            this.componentFactoryResolver,
            this.appRef,
            this.injector);

        bodyPortalHost.attach(stepComponent);
    }
}
