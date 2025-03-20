import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerToolbarComponent } from './customer-toolbar.component';

describe('CustomerToolbarComponent', () => {
  let component: CustomerToolbarComponent;
  let fixture: ComponentFixture<CustomerToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
