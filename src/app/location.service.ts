import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";

export const LOCATIONS: string = "locations";

export type Location = {
  zipcode: string;
  action: 'add' | 'remove'
};

@Injectable()
export class LocationService {
  private _locations$ = new ReplaySubject<Location>();
  location$ = this._locations$.asObservable();
  locations: string[] = [];

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    this.locations.forEach(zipcode => this._locations$.next({
      zipcode,
      action: 'add'
    }));
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this._locations$.next({
      zipcode,
      action: 'add'
    })
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this._locations$.next({
        zipcode,
        action: 'remove'
      })
    }
  }
}
