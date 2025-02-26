import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VenderService } from '../services/service.service';
import { ServiceModel } from '../models/service.model';

@Component({
  selector: 'app-vender-service-form',
  templateUrl: './vender-service-form.component.html',
  styleUrl: './vender-service-form.component.scss'
})
export class VenderServiceFormComponent implements OnInit {

  serviceForm! : FormGroup;
  isSubmitting: boolean = false;
  constructor( private fb : FormBuilder, private ServiceServices: VenderService) { 
  }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      pricing: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = this.serviceForm.value;
    const formvalues: ServiceModel = {
      ...formData
    }

    const venderId = localStorage.getItem('vendorId');
    formvalues.vendorId = venderId ? Number(venderId) : 0;

    this.ServiceServices.createService(formvalues).subscribe(
      (response: any) => {
        if (response.message === 'Service created successfully!') {
          console.log('Service created successfully', response);
          this.serviceForm.reset();
          this.isSubmitting = false;
        }
      },
      (error: any) => {
        console.error('Error creating service', error);
        this.serviceForm.reset();
        this.isSubmitting = false;
      }
    );
    this.serviceForm.reset();
  }

}
