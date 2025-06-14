import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorManagementComponent } from './vendor-management.component';

describe('VendorManagementComponent', () => {
  let component: VendorManagementComponent;
  let fixture: ComponentFixture<VendorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vendor requests on init', () => {
    expect(component.vendorRequests.length).toBe(3);
  });

  it('should toggle between pending requests and active vendors', () => {
    expect(component.showActiveVendors).toBeFalse();
    
    component.loadActiveVendors();
    expect(component.showActiveVendors).toBeTrue();
    
    component.showPendingRequests();
    expect(component.showActiveVendors).toBeFalse();
  });

  it('should approve vendor', () => {
    const vendorId = '1';
    component.approveVendor(vendorId);
    
    const vendor = component.vendorRequests.find(v => v.id === vendorId);
    expect(vendor?.status).toBe('approved');
  });

  it('should reject vendor', () => {
    const vendorId = '1';
    component.rejectVendor(vendorId);
    
    const vendor = component.vendorRequests.find(v => v.id === vendorId);
    expect(vendor?.status).toBe('rejected');
  });
});
