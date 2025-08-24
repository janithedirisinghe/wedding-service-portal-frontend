import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VenderService } from '../services/service.service';
import { ServiceModel } from '../models/service.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-service-form',
  templateUrl: './vender-service-form.component.html',
  styleUrl: './vender-service-form.component.scss'
})
export class VenderServiceFormComponent implements OnInit {

  serviceForm! : FormGroup;
  isSubmitting: boolean = false;
  userId: Number = 0;
  constructor( private fb : FormBuilder, private ServiceServices: VenderService,private authService: AuthService, private router: Router,
      private toastr: ToastrService) { 
  } 

  ngOnInit(): void {
     this.userId = Number(this.authService.getUserId());
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      pricing: [null, [Validators.required, Validators.min(0)]],
      pricingModel: ['FIXED', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      advancePercentage: [null, [Validators.min(0), Validators.max(100)]],
      discountPercent: [null, [Validators.min(0), Validators.max(100)]],
      bookBeforeDays: [null, [Validators.min(0)]],
      isAvailable: [true],
      serviceAreaType: ['LOCAL', [Validators.required]],
      cancellationPolicy: [''],
    });
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = this.serviceForm.value;
    const formvalues: ServiceModel = {
      name: formData.name,
      description: formData.description,
      pricing: Number(formData.pricing),
      userId: Number(this.userId),
      pricingModel: formData.pricingModel,
      status: formData.status,
      advancePercentage: formData.advancePercentage !== null ? Number(formData.advancePercentage) : null,
      discountPercent: formData.discountPercent !== null ? Number(formData.discountPercent) : null,
      bookBeforeDays: formData.bookBeforeDays !== null ? Number(formData.bookBeforeDays) : null,
      isAvailable: formData.isAvailable,
      serviceAreaType: formData.serviceAreaType,
      cancellationPolicy: formData.cancellationPolicy,
    };
    const venderId = this.userId;
    formvalues.userId = venderId ? Number(venderId) : 0;
    // debugger;

    this.ServiceServices.createService(formvalues).subscribe(
      (response: any) => {
        if (response.message === 'Service created successfully!') {
          console.log('Service created successfully', response);
          this.serviceForm.reset();
          this.isSubmitting = false;
          this.router.navigate(['vender/serviceList']);
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
