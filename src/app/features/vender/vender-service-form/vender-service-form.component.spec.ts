import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderServiceFormComponent } from './vender-service-form.component';

describe('VenderServiceFormComponent', () => {
  let component: VenderServiceFormComponent;
  let fixture: ComponentFixture<VenderServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderServiceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
