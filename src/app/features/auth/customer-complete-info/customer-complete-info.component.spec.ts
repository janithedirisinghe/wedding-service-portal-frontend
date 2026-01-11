import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCompleteInfoComponent } from './customer-complete-info.component';

describe('CustomerCompleteInfoComponent', () => {
  let component: CustomerCompleteInfoComponent;
  let fixture: ComponentFixture<CustomerCompleteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerCompleteInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerCompleteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
