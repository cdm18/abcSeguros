import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3DetallesSeguroComponent } from './step3-detalles-seguro.component';

describe('Step3DetallesSeguroComponent', () => {
  let component: Step3DetallesSeguroComponent;
  let fixture: ComponentFixture<Step3DetallesSeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3DetallesSeguroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3DetallesSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
