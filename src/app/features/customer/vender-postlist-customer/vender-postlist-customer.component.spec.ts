import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderPostlistCustomerComponent } from './vender-postlist-customer.component';

describe('VenderPostlistCustomerComponent', () => {
  let component: VenderPostlistCustomerComponent;
  let fixture: ComponentFixture<VenderPostlistCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderPostlistCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderPostlistCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
