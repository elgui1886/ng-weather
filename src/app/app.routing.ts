import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForecastsListComponent} from "./components/forecasts-list/forecasts-list.component";
import {MainPageComponent} from "./components/main-page/main-page.component";

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'forecast/:zipcode', component: ForecastsListComponent
  }
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes, {});
