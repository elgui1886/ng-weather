import { Injectable } from "@angular/core";
import { WeatherService } from "./weather.service";
import { BehaviorSubject } from "rxjs";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private locations$ = new BehaviorSubject<string[]>([]);

  location$ = this.locations$.asObservable();

  locations: string[] = [];

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    this.locations$.next(this.locations);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
