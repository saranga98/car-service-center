import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  isStatisticsVisible = false;
  isCarVisible = false;
  isSidebarExpanded = true;

  currentComponent: string = 'statistics';

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
    // Optionally, set the initial language based on browser or user preference
    this.translate.use('en');
  }
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
  showStatistics() {
    this.isStatisticsVisible = !this.isStatisticsVisible;
  }

  addCar() {
    this.isCarVisible = !this.isCarVisible;
  }

  showComponent(component: string) {
    this.currentComponent = component;
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value;
    this.translate.use(language); // Switch to the selected language
  }
}
