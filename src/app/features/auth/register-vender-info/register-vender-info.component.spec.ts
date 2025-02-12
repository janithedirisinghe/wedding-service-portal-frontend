import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVenderInfoComponent } from './register-vender-info.component';

describe('RegisterVenderInfoComponent', () => {
  let component: RegisterVenderInfoComponent;
  let fixture: ComponentFixture<RegisterVenderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterVenderInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterVenderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
