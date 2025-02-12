import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderCalenderComponent } from './vender-calender.component';

describe('VenderCalenderComponent', () => {
  let component: VenderCalenderComponent;
  let fixture: ComponentFixture<VenderCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderCalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
