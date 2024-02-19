import { TabComponent } from "../tab/tab.component";
import {
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  computed,
  signal,
} from "@angular/core";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.scss",
})
export class TabsComponent {
  // All tabs, including removed ones
  private _allTabs = signal<QueryList<TabComponent>>(
    new QueryList<TabComponent>()
  );
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

  @ContentChildren(TabComponent)
  set tabs(tabs: QueryList<TabComponent>) {
    this._allTabs.set(tabs);
    // Since new tabs are coming, we need to reset the removed tabs
    this._removedTabIds.set([]);
    // If there is no selected tab, set the first tab as selected
    if (tabs.length > 0 && !this.currentSelectedTab()) {
      this.currentSelectedTab.set(tabs.first);
    }
  }
  get tabs() {
    return this._allTabs();
  }

  @Output() selectedTabChanged = new EventEmitter<TabComponent>();
  @Output() removeTabClicked = new EventEmitter<TabComponent>();

  selectedTabChangeClick(tab: TabComponent) {
    if(this.currentSelectedTab() === tab) return;
    this.currentSelectedTab.set(tab);
    this.selectedTabChanged.emit(tab);
  }

  removeTabClick(tab: TabComponent) {
    // check if the removed that was the active one
    if (tab.id === this.currentSelectedTab().id) {
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
}
