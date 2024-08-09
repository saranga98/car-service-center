import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

interface Job {
  carId: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  providers: [MessageService]
})
export class JobComponent implements OnInit {

  carId: string = '';
  description: string = '';
  status: string = '';
  statuses: any[] = [];
  jobs: Job[] = [];

  constructor(private messageService: MessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.loadJobs();
    this.updateStatuses(); // Update statuses on initialization
    this.translate.onLangChange.subscribe(() => this.updateStatuses()); // Update statuses when language changes
  }

  updateStatuses() {
    this.translate.get(['PENDING', 'IN_PROGRESS', 'COMPLETED']).subscribe(translations => {
      this.statuses = [
        { label: translations['PENDING'], value: 'Pending' },
        { label: translations['IN_PROGRESS'], value: 'In Progress' },
        { label: translations['COMPLETED'], value: 'Completed' }
      ];
    });
  }

  addJob() {
    if (this.carId && this.description && this.status) {
      this.jobs.push({ carId: this.carId, description: this.description, status: this.status });
      this.saveJobs();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Job added successfully!' });
      this.resetForm();
    } else {
      alert('Please fill out all fields.');
    }
  }

  saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(this.jobs));
  }

  loadJobs() {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      this.jobs = JSON.parse(savedJobs);
    }
  }

  resetForm() {
    this.carId = '';
    this.description = '';
    this.status = '';
  }

  editJob(index: number) {
    const job = this.jobs[index];
    this.carId = job.carId;
    this.description = job.description;
    this.status = job.status;
    this.jobs.splice(index, 1);
    this.saveJobs();
  }

  deleteJob(index: number) {
    this.jobs.splice(index, 1);
    this.saveJobs();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Job deleted successfully!' });
  }

  updateStatus(job: Job, newStatus: string) {
    job.status = newStatus;
    this.saveJobs();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Job status updated!' });
  }
}
