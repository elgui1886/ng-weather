import { NgModule } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { CommonModule } from '@angular/common';
import { TabHeaderDirective } from './directives/tab-header.directive';
import { TabBodyDirective } from './directives/tab-body.directive.';



@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    TabHeaderDirective,
    TabBodyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [TabsComponent, TabComponent, TabHeaderDirective, TabBodyDirective],
})
export class SharedModule { }
