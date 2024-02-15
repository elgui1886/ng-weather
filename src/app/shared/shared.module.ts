import { NgModule } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';



@NgModule({
  declarations: [
    TabsComponent,
    TabComponent
  ],
  imports: [
  ],
  exports: [TabsComponent, TabComponent],
})
export class SharedModule { }
