import { Observable } from 'rxjs';

export interface TourStep {
    step: string;
    content$: Observable<any>;
}
