import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderServiceTableComponent } from './vender-service-table.component';

describe('VenderServiceTableComponent', () => {
  let component: VenderServiceTableComponent;
  let fixture: ComponentFixture<VenderServiceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderServiceTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderServiceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
