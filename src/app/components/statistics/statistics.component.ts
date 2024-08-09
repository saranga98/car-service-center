import { Component, Inject, makeStateKey, OnInit, PLATFORM_ID, TransferState } from '@angular/core';
import { MessageService } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';

const CARS_KEY = makeStateKey<string[]>('cars');
const JOBS_KEY = makeStateKey<string[]>('jobs');
interface Job {
  carId: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  providers: [MessageService]
})
export class StatisticsComponent implements OnInit {

  cars: string[] = [];
  jobs: any[] = [];
  totalCars: number = 0;
  jobsInProgress: number = 0;
  chartData: any;
  jobStatuses: Record<string, number> = {};  // Define the jobStatuses property

  constructor(
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromBrowser();
    } else {
      this.loadFromServer();
    }
    this.updateDashboard();
    this.prepareChartData();
  }

  loadFromBrowser() {
    const savedCars = localStorage.getItem('cars');
    const savedJobs = localStorage.getItem('jobs');
    if (savedCars) {
      this.cars = JSON.parse(savedCars);
      this.totalCars = this.cars.length;
    }
    if (savedJobs) {
      this.jobs = JSON.parse(savedJobs);
      this.jobStatuses = this.jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
  }

  loadFromServer() {
    this.cars = this.transferState.get(CARS_KEY, []);
    this.jobs = this.transferState.get(JOBS_KEY, []);
    this.totalCars = this.cars.length;
    this.jobStatuses = this.jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  updateDashboard() {
    this.jobsInProgress = this.jobs.filter(job => job.status === 'In Progress').length;
  }

  prepareChartData() {
    const statusData = Object.entries(this.jobStatuses).map(([status, count]) => ({
      name: status,
      value: count
    }));
    
    this.chartData = {
      labels: statusData.map(item => item.name),
      datasets: [
        {
          data: statusData.map(item => item.value),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };
  }

}
