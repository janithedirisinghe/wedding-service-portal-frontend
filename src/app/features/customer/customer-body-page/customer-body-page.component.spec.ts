import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBodyPageComponent } from './customer-body-page.component';

describe('CustomerBodyPageComponent', () => {
  let component: CustomerBodyPageComponent;
  let fixture: ComponentFixture<CustomerBodyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerBodyPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerBodyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
