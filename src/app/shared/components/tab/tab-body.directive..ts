import { Directive, TemplateRef, inject } from "@angular/core";

@Directive({
    selector: '[tab-body]',
})
export class TabBodyDirective {
    template = inject(TemplateRef);
}