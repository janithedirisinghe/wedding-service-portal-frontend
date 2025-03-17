import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTimelineComponent } from './customer-timeline.component';

describe('CustomerTimelineComponent', () => {
  let component: CustomerTimelineComponent;
  let fixture: ComponentFixture<CustomerTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
