import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderSidebarComponent } from './vender-sidebar.component';

describe('VenderSidebarComponent', () => {
  let component: VenderSidebarComponent;
  let fixture: ComponentFixture<VenderSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
