import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3HogarComponent } from './step3-hogar.component';

describe('Step3HogarComponent', () => {
  let component: Step3HogarComponent;
  let fixture: ComponentFixture<Step3HogarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3HogarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3HogarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
