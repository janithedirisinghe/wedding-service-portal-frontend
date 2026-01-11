import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderBookingRequestsComponent } from './vender-booking-requests.component';

describe('VenderBookingRequestsComponent', () => {
  let component: VenderBookingRequestsComponent;
  let fixture: ComponentFixture<VenderBookingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenderBookingRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenderBookingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
