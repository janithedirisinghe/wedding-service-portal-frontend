import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderProfileCustomerComponent } from './vender-profile-customer.component';

describe('VenderProfileCustomerComponent', () => {
  let component: VenderProfileCustomerComponent;
  let fixture: ComponentFixture<VenderProfileCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderProfileCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderProfileCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
