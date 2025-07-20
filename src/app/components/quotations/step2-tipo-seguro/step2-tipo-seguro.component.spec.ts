import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2TipoSeguroComponent } from './step2-tipo-seguro.component';

describe('Step2TipoSeguroComponent', () => {
  let component: Step2TipoSeguroComponent;
  let fixture: ComponentFixture<Step2TipoSeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2TipoSeguroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step2TipoSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
