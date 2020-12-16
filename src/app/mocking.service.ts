import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockingService {
  private content: Map<number, string> = new Map();
  constructor() {
    this.content.set(1, 'Dit is een vlak.');
    this.content.set(2, 'Dit is een card');
    this.content.set(3, 'Dit is ook een card');
    this.content.set(4, 'En dit een button');
  }


  getContent(id: number): Observable<string> {
    return of(this.content.get(id));
  }
}
