import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderLoginComponent } from './vender-login.component';

describe('VenderLoginComponent', () => {
  let component: VenderLoginComponent;
  let fixture: ComponentFixture<VenderLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
