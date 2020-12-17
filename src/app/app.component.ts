import { Component } from '@angular/core';
import { ToursService } from './tours/services/tours.service';
import { MockingService } from './mocking.service';
import { PortalService } from './tours/services/portal.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private tourService: ToursService, private mockService: MockingService) { }

  startTour(): void {
    const steps = [
      {
        step: 'step-1',
        content$: this.mockService.getContent(1)
      },
      {
        step: 'card-1',
        content$: this.mockService.getContent(2)
      },
      {
        step: 'card-5',
        content$: this.mockService.getContent(3)
      },
      {
        step: 'start-tour-button',
        content$: this.mockService.getContent(4)
      },
      {
        step: 'card-7',
        content$: this.mockService.getContent(3)
      },
      {
        step: 'card-12',
        content$: this.mockService.getContent(3)
      }
    ];


    this.tourService.startTour({ steps });
  }
}
