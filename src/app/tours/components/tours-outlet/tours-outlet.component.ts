import { Component, ComponentRef, ViewChild } from '@angular/core';
import { TourStepComponent } from '../tour-step/tour-step.component';

@Component({
  selector: 'tour-outlet',
  templateUrl: './tours-outlet.component.html',
  styleUrls: ['./tours-outlet.component.scss']
})
export class TourOutletComponent {
  @ViewChild(TourStepComponent, { static: true }) step: TourStepComponent;
}
