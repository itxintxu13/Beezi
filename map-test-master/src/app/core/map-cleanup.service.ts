import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapCleanupService {
  private _clear$ = new Subject<void>();
  /** Observable que los componentes pueden subscribir para ejecutar limpieza local */
  readonly clear$: Observable<void> = this._clear$.asObservable();

  /** Dispara la señal para que los componentes limpien hotspots/animaciones */
  triggerClear(): void {
    try { this._clear$.next(); } catch (e) { console.debug('MapCleanupService trigger error', e); }
  }
}
