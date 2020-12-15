import { Component } from '@angular/core';
import { ToursService } from './tours/services/tours.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private tourService: ToursService) {}

  startTour(): void {
    this.tourService.startTour({ steps: ['card-1', 'card-1', 'card-4', 'card-9']});
  }
}
