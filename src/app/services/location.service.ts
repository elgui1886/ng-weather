import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

const LOCATIONS: string = "locations";
type Locations = {
  zipcode?: string;
  action: LocationAction;
  zipcodes: string[];
};
export type LocationAction = "add" | "remove" | "load";

@Injectable()
export class LocationService {
  private _locations$ = new ReplaySubject<Locations>();

  // Private Set of zipcodes
  private get _zipcodes(): Set<string> {
    const locString = localStorage.getItem(LOCATIONS);
    let zipcodes = [];
    if (locString) zipcodes = JSON.parse(locString);
    return new Set(zipcodes);
  }

  // Public notifier for location changes
  location$ = this._locations$.asObservable();

  constructor() {
    const zipcodes = [...this._zipcodes];
    this._locations$.next({
      action: "load",
      zipcodes,
    });
  }

  addLocation(zipcode: string) {
    // Prevent emtpy add
    if (!zipcode) return;
    // Add the zipcode to the list of zipcodes if not exists
    if (this._zipcodes.has(zipcode)) return;
    const newzipcodes = [...this._zipcodes, zipcode];
    this._updateLocations(newzipcodes, "add", zipcode);
  }
  removeLocation(zipcode: string) {
    if (!this._zipcodes.has(zipcode)) return;
    const newzipcodes = new Set(this._zipcodes);
    newzipcodes.delete(zipcode);
    this._updateLocations([...newzipcodes], "remove", zipcode);
  }

  private _updateLocations(
    zipcodes: string[],
    action: LocationAction,
    target: string
  ) {
    localStorage.setItem(LOCATIONS, JSON.stringify(zipcodes));
    this._locations$.next({
      zipcode: target,
      action,
      zipcodes,
    });
  }
}
