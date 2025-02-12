import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderMeetingRequstsComponent } from './vender-meeting-requsts.component';

describe('VenderMeetingRequstsComponent', () => {
  let component: VenderMeetingRequstsComponent;
  let fixture: ComponentFixture<VenderMeetingRequstsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderMeetingRequstsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderMeetingRequstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
