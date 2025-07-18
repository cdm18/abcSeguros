import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3ViajeComponent } from './step3-viaje.component';

describe('Step3ViajeComponent', () => {
  let component: Step3ViajeComponent;
  let fixture: ComponentFixture<Step3ViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3ViajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3ViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
