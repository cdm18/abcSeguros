import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1DatosPersonalesComponent } from './step1-datos-personales.component';

describe('Step1DatosPersonalesComponent', () => {
  let component: Step1DatosPersonalesComponent;
  let fixture: ComponentFixture<Step1DatosPersonalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1DatosPersonalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step1DatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
