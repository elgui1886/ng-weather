import { Directive, TemplateRef, inject } from "@angular/core";

@Directive({
    selector: '[tab-header]',
})
export class TabHeaderDirective {
    template = inject(TemplateRef);
}