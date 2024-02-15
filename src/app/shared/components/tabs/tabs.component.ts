import { Subject } from "rxjs";
import { TabComponent } from "../tab/tab.component";
import {
  AfterContentInit,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
  effect,
  signal,
} from "@angular/core";
import { takeUntil, tap } from "rxjs/operators";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.scss",
})
export class TabsComponent implements AfterContentInit, OnDestroy {
  private _destroy = new Subject();

  currentSelectedTab = signal<TabComponent>(undefined);
  currentTabs = signal<QueryList<TabComponent>>(new QueryList<TabComponent>());
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor() {
    effect(() => {
      const currentselectedtab = this.currentSelectedTab();
      const tabs = this.currentTabs();
      tabs.forEach((tab) => {
        tab.active = tab === currentselectedtab;
      });
    });
  }

  ngAfterContentInit(): void {
    this.tabs.changes
      .pipe(
        // we need to tap to make sure that currentSelectedTab is set
        tap((tabs) => {
          if (tabs.length && !this.currentSelectedTab()) {
            this.currentSelectedTab.set(tabs.first);
          }
        }),
        takeUntil(this._destroy)
      )
      .subscribe((tabs) => this.currentTabs.set(tabs));
  }

  seletedTabChange(tab: TabComponent) {
    this.currentSelectedTab.set(tab);
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }
}
