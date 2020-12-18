import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { TourStepComponent } from './components/tour-step/tour-step.component';
import { TourOutletComponent } from './components/tours-outlet/tours-outlet.component';
import { ToursService } from './services/tours.service';

@NgModule({
  declarations: [
    TourStepComponent,
    TourOutletComponent
  ],
  imports: [
    CommonModule,
    PortalModule
  ],
  providers: [
    ToursService
  ]
})
export class ToursModule { }
