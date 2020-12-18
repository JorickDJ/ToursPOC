import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockingService {
  private content: Map<number, string> = new Map();
  constructor() {
    this.content.set(1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dictum dolor ut neque vehicula egestas id quis augue. In finibus viverra tincidunt. Vivamus consectetur tincidunt faucibus. Quisque placerat a metus at vehicula. Curabitur bibendum lobortis neque sed placerat. Fusce ac interdum justo.');
    this.content.set(2, 'Morbi molestie id lorem sit amet mattis. Quisque in blandit tortor. Mauris velit felis, dignissim sed finibus sit amet, tempus vel enim. Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce interdum, quam eget dictum viverra, nulla dui mattis elit, id dictum tellus mi quis urna. Morbi id sollicitudin massa. Nunc congue cursus purus nec varius. Integer ullamcorper ac orci vel vestibulum. Maecenas commodo congue sapien, nec tincidunt ante feugiat vitae. Phasellus malesuada tortor sed tempus accumsan. Integer metus arcu, blandit sed elementum sit amet, lacinia vel justo.');
    this.content.set(3, 'Dit is ook een card');
    this.content.set(4, 'En dit een button');
  }


  getContent(id: number): Observable<string> {
    return of(this.content.get(id));
  }
}
