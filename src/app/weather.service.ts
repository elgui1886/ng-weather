import { Injectable, Signal, signal } from "@angular/core";
import { Observable, Subject, forkJoin, of } from "rxjs";
import { switchMap, map, tap, mergeMap, concatMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { LocationAction, LocationService } from "./location.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable()
export class WeatherService {
  static URL = "http://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);

  /**
   * We prefer working with  @see {@link Locations} object insead of single zip code
   * This object provide information about:
   * - the action performed: add, remove, load;
   * - the target zipcode of the action;
   * - the list of updates locations.
   * Add action: is used when user add a new location
   * Remove action: is used when we remove a location
   * Load action: is used when we load all locations from localstorage
   *
   * Using forkJoin to make multiple requests at the same time in case of initial load
   * We use concatMap to add a new location and remove a location because we want to maintain the order of the actions
   * For example if we add a location and then remove it, we want to make sure that the location is added before it is removed
   * 
   * This pattern is used to avoid nested subscribe in old addCurrentConditions method.
   * @param http
   * @param locationService
   */
  constructor(private http: HttpClient, locationService: LocationService) {
    locationService.location$
      .pipe(
        concatMap(({ action, zipcodes, zipcode }) => {
          if (action === "add") {
            return this.addCurrentConditions$(zipcode, action).pipe(
              tap((condition) => this.addCurrentConditions(condition))
            );
          }
          if (action === "remove") {
            return this.removeCurrentConditions$(zipcode, action).pipe(
              tap(({ zip }) => this.removeCurrentConditions(zip))
            );
          }
          if (action === "load") {
            const mapped = zipcodes.map((location) =>
              this.addCurrentConditions$(location, action)
            );
            return forkJoin(mapped).pipe(
              tap((conditions) =>
                conditions.forEach((condition) =>
                  this.addCurrentConditions(condition)
                )
              )
            );
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  /**
   * Api call to obtain singlle location data
   * @param zipcode 
   * @param action 
   * @returns Observable<ConditionsAndZip>
   */
  addCurrentConditions$(zipcode: string, action: LocationAction): Observable<ConditionsAndZip> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http
      .get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
      .pipe(map((data) => ({ zip: zipcode, data, action })));
  }

    /**
   * Observable mapper to ConditionsAndZip for observable type compliance
   * @param zipcode 
   * @param action 
   * @returns Observable<ConditionsAndZip> with undefined data because the is no need to make a request to remove a location
   */
  removeCurrentConditions$(zipcode: string, action: LocationAction): Observable<ConditionsAndZip> {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    return of({ zip: zipcode, data: undefined, action });
  }

  addCurrentConditions({ zip: zipcode, data }: ConditionsAndZip) {
    this.currentConditions.update((conditions) => [
      ...conditions,
      { zip: zipcode, data },
    ]);
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
