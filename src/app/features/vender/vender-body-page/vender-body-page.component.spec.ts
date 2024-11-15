import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderBodyPageComponent } from './vender-body-page.component';

describe('VenderBodyPageComponent', () => {
  let component: VenderBodyPageComponent;
  let fixture: ComponentFixture<VenderBodyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderBodyPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderBodyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
