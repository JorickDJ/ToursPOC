import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourStepComponent } from './components/tour-step/tour-step.component';
import { TourOutletComponent } from './components/tours-outlet/tours-outlet.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [TourStepComponent, TourOutletComponent],
  imports: [
    CommonModule,
    PortalModule
  ],
  entryComponents: [
    TourStepComponent
  ]
})
export class ToursModule { }
