import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4CompararOpcionesComponent } from './step4-comparar-opciones.component';

describe('Step4CompararOpcionesComponent', () => {
  let component: Step4CompararOpcionesComponent;
  let fixture: ComponentFixture<Step4CompararOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step4CompararOpcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step4CompararOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
