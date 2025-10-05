import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UnifiedMapComponent } from './app.unified-map';


@Component({
  selector: 'app-root',
  imports: [ UnifiedMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('map-test');
}
