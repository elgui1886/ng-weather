import { Subject } from "rxjs";
import { TabComponent } from "../tab/tab.component";
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  computed,
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
  // All tabs, including removed ones
  private _allTabs = signal<QueryList<TabComponent>>(new QueryList<TabComponent>());
  // Removed tabs id list
  private _removedTabIds = signal<string[]>([]);

  // Current selected tab
  currentSelectedTab = signal<TabComponent>(undefined);

  // All tabs that are not removed
  currentDisplayedTabs = computed(() => {
    // We need to show only not removed tabs
    const allTabs = this._allTabs();
    const removedTabs = this._removedTabIds();
    const filtered = allTabs.filter((tab) => !removedTabs.includes(tab.id));
    return filtered;
  });

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Output() selectedTabChanged = new EventEmitter<TabComponent>();
  @Output() removeTabClicked = new EventEmitter<TabComponent>();

  /**
  * Listen for changes of the tabs QueryList
  * When the tabs change, we need to make sure that the currentSelectedTab is set
  * Listen for changes is necessary because the tabs QueryList is not available immediately,
  * and can change over time
  */
  ngAfterContentInit(): void {
    this.tabs.changes
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe((tabs) => {
        // set new tabs
        this._allTabs.set(tabs);
        // Since new tabs are coming, we need to reset the removed tabs
        this._removedTabIds.set([]);
        // If there is no selected tab, set the first tab as selected
        if (tabs.length > 0 && !this.currentSelectedTab()) {
          debugger;
          this.currentSelectedTab.set(tabs.first);
        }
      });
  }

  seletedTabChange(tab: TabComponent) {
    this.currentSelectedTab.set(tab);
    this.selectedTabChanged.emit(tab);
  }

  removeTab(tab: TabComponent) {
    // check if the removed that was the active one
    if (tab.id === this.currentSelectedTab()?.id) {
      const tabs = this.currentDisplayedTabs();
      const index = tabs.indexOf(tab);
      // if it is not the first tab that has been removed, set the previous one as active
      if (index > 0) {
        this.currentSelectedTab.set(tabs[index - 1]);
      }
      // if it is the first tab that has been removed, and the is more than one tab, set the next one as active
      else if (index === 0 && tabs.length > 1) {
        this.currentSelectedTab.set(tabs[index + 1]);
      }
      // no tabs left, set the currentSelectedTab to undefined 
      else {
        this.currentSelectedTab.set(undefined);
      }
    }
    this._removedTabIds.update(removeIds => [...removeIds, tab.id]);
    this.removeTabClicked.emit(tab);
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }
}
