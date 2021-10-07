/**
 * This file does the marker for the maps (in theory)
 *
 * started by Wynton Huang - raise any issues with this file with him
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  locations: string = '/assets/data/test_geo.geojson';

  constructor(private http: HttpClient) { }

  makeLocationMarkers(map: L.Map): void {
    this.http.get(this.locations).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      }
    });
  }
}
