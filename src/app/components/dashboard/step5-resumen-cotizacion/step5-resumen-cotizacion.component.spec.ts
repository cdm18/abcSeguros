import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5ResumenCotizacionComponent } from './step5-resumen-cotizacion.component';

describe('Step5ResumenCotizacionComponent', () => {
  let component: Step5ResumenCotizacionComponent;
  let fixture: ComponentFixture<Step5ResumenCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step5ResumenCotizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step5ResumenCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
