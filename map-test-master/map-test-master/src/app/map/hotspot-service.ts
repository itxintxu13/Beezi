import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotspot } from './hotspot.model';

@Injectable({
  providedIn: 'root'
})
export class HotspotService {
  private url = "data/hotspots.json";

  constructor(private readonly http: HttpClient) { }

  getHotspots(): Observable<Hotspot[]> {
    return this.http.get<Hotspot[]>(this.url);
  }
}
