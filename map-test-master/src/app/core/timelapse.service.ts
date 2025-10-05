import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type TimelapseCommand = 'start' | 'stop' | 'toggle';

@Injectable({ providedIn: 'root' })
export class TimelapseService {
  private _cmd$ = new Subject<TimelapseCommand>();
  readonly commands$: Observable<TimelapseCommand> = this._cmd$.asObservable();

  toggle(): void { try { this._cmd$.next('toggle'); } catch (e) { console.debug('timelapse toggle error', e); } }
  start(): void { try { this._cmd$.next('start'); } catch (e) { console.debug('timelapse start error', e); } }
  stop(): void { try { this._cmd$.next('stop'); } catch (e) { console.debug('timelapse stop error', e); } }
}
