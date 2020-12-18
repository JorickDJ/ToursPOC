import { Component } from '@angular/core';
import { TourService } from './tours/services/tour.service';
import { MockingService } from './mocking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private tourService: TourService, private mockService: MockingService) { }

  startTour(): void {
    const steps = [
      {
        step: 'step-1',
        content$: this.mockService.getContent(1),
        title: 'Stap 1'
      },
      {
        step: 'select-1',
        content$: this.mockService.getContent(3)
      },
      {
        step: 'card-13',
        content$: this.mockService.getContent(2)
      },
      {
        step: 'card-14',
        content$: this.mockService.getContent(2)
      }
    ];


    this.tourService.startTour(steps);
  }
}
