import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VenderChatComponent } from './vender-chat.component';
import { VenderHeaderComponent } from '../../../shared/components/vender-header/vender-header.component';

describe('VenderChatComponent', () => {
  let component: VenderChatComponent;
  let fixture: ComponentFixture<VenderChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenderChatComponent],
      imports: [CommonModule, FormsModule, VenderHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenderChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
