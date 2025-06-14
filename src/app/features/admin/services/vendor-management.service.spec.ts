import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VendorManagementService } from './vendor-management.service';

describe('VendorManagementService', () => {
  let service: VendorManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(VendorManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get pending vendor requests', (done) => {
    service.getPendingVendorRequests().subscribe(requests => {
      expect(requests).toBeDefined();
      expect(requests.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should get active vendors', (done) => {
    service.getActiveVendors().subscribe(vendors => {
      expect(vendors).toBeDefined();
      expect(vendors.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should approve vendor', (done) => {
    service.approveVendor('test-id').subscribe(response => {
      expect(response.success).toBeTruthy();
      done();
    });
  });

  it('should reject vendor', (done) => {
    service.rejectVendor('test-id').subscribe(response => {
      expect(response.success).toBeTruthy();
      done();
    });
  });
});
