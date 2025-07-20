import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3VidaComponent } from './step3-vida.component';

describe('Step3VidaComponent', () => {
  let component: Step3VidaComponent;
  let fixture: ComponentFixture<Step3VidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3VidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3VidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
