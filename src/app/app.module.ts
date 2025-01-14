import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './components/zipcode-entry/zipcode-entry.component';
import {LocationService} from "./services/location.service";
import { ForecastsListComponent } from './components/forecasts-list/forecasts-list.component';
import {WeatherService} from "./services/weather.service";
import { CurrentConditionsComponent } from './components/current-conditions/current-conditions.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    SharedModule
  ],
  providers: [LocationService, WeatherService, { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
