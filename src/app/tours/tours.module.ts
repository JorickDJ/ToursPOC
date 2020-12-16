import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourStepComponent } from './components/tour-step/tour-step.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [TourStepComponent],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    TourStepComponent
  ],
  entryComponents: [
    TourStepComponent
  ]
})
export class ToursModule { }
