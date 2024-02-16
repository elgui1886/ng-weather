import { AfterContentInit, Component, ContentChild, Input, TemplateRef, ViewChild, booleanAttribute } from '@angular/core';
import { TabBodyDirective } from './tab-body.directive.';
import { TabHeaderDirective } from './tab-header.directive';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @ContentChild(TabHeaderDirective) tabHeader: TabHeaderDirective;
  @ContentChild(TabBodyDirective) tabBody: TabBodyDirective;

  @Input({
    required: true
  }) id: string = '';

  @Input() title: string = '';
}
