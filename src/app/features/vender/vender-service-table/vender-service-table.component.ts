import { Component, OnInit } from '@angular/core';
import { VenderService } from '../services/service.service';
import { ServiceByVendor, ServiceModel } from '../models/service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-service-table',
  templateUrl: './vender-service-table.component.html',
  styleUrl: './vender-service-table.component.scss'
})
export class VenderServiceTableComponent implements OnInit{
  venderServiceDetails: ServiceByVendor[] = [];


  constructor(private venderService: VenderService, private router: Router){}

  ngOnInit(): void {
    this.getServiceDetailsByVendorId(4);
  }

  getServiceDetailsByVendorId(vendorId: number){
    this.venderService.getServicesByVenderId(vendorId).subscribe((data: ServiceByVendor[]) => {
      this.venderServiceDetails = data;
    });
  }

  editService(){}

  deleteService(){} 

  addNewService(){
    this.router.navigate(['/vender/createService']);
  }

}
