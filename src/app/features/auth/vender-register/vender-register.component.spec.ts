import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderRegisterComponent } from './vender-register.component';

describe('VenderRegisterComponent', () => {
  let component: VenderRegisterComponent;
  let fixture: ComponentFixture<VenderRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
