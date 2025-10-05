import { Routes } from '@angular/router';
import { Mapa } from './map/mapa/mapa';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: Mapa },
]
