import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

const LOCATIONS: string = "locations";
type Locations = {
  zipcode?: string;
  action: LocationAction,
  zipcodes: string[]
};
export type LocationAction = 'add' | 'remove' | 'load';

@Injectable()
export class LocationService {
  private _locations$ = new ReplaySubject<Locations>();
  // Set to easly prevent users from adding the same location multiple times
  private _locationSet = new Set<string>();
  private get _locations() {
    return [...this._locationSet];
  }

  location$ = this._locations$.asObservable();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this._locationSet = new Set(JSON.parse(locString));
    this._locations$.next({
      action: 'load',
      zipcodes: this._locations
    });
  }

  addLocation(zipcode: string) {
    if(!zipcode) return;
    if (this._locationSet.has(zipcode)) return;
    this._locationSet.add(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this._locations));
    this._locations$.next({
      zipcode,
      action: 'add',
      zipcodes: this._locations
    })
  }
  removeLocation(zipcode: string) {
    if (this._locationSet.has(zipcode)) {
      this._locationSet.delete(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations));
      this._locations$.next({
        zipcode,
        action: 'remove',
        zipcodes: this._locations
      })

    };
  }
}
