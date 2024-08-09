import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Car {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss',
  providers: [MessageService]
})
export class CarComponent implements OnInit {

  newCar: Car = { make: '', model: '', year: '', licensePlate: '' };
  cars: Car[] = [];
  editingIndex: number | null = null;

  constructor(private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.loadCars();
  }

  addCar() {
    if (this.newCar.make && this.newCar.model && this.newCar.year && this.newCar.licensePlate) {
      if (this.editingIndex !== null) {
        // Update existing car
        this.cars[this.editingIndex] = { ...this.newCar };
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car updated successfully!' });
        this.editingIndex = null;  // Reset editing index
      } else {
        // Add new car
        this.cars.push({ ...this.newCar });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car added successfully!' });
      }
      this.saveCars();
      this.resetForm(); // Reset form and state
    } else {
      alert('Please fill out all fields.');
    }
  }

  saveCars() {
    localStorage.setItem('cars', JSON.stringify(this.cars));
  }

  loadCars() {
    const savedCars = localStorage.getItem('cars');
    if (savedCars) {
      this.cars = JSON.parse(savedCars);
    }
  }

  editCar(index: number) {
    this.newCar = { ...this.cars[index] };
    this.editingIndex = index; // Set index of the car being edited
  }

  deleteCar(index: number) {
    this.cars.splice(index, 1);
    this.saveCars();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car deleted successfully!' });
  }

  // Define the resetForm method
  resetForm() {
    this.newCar = { make: '', model: '', year: '', licensePlate: '' }; // Reset form fields
    this.editingIndex = null;  // Reset editing index to add mode
  }

}
