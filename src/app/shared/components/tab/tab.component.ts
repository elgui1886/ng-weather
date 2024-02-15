import { Component,  Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent {

  @Input({
    required: true
  }) id: string = '';

  @Input() title: string = '';

  @Input({
    transform: booleanAttribute
  }) active = false;

}
