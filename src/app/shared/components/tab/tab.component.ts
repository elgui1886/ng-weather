import { AfterContentInit, Component, ContentChild, Input, TemplateRef, ViewChild, booleanAttribute } from '@angular/core';
import { TabBodyDirective } from '../../directives/tab-body.directive.';
import { TabHeaderDirective } from '../../directives/tab-header.directive';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {
  @ContentChild(TabHeaderDirective) tabHeader: TabHeaderDirective | undefined;
  @ContentChild(TabBodyDirective) tabBody: TabBodyDirective  | undefined;

  @Input({
    required: true
  }) id: string = '';

  @Input() title: string = '';
}
