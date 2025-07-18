import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3AutoComponent } from './step3-auto.component';

describe('Step3AutoComponent', () => {
  let component: Step3AutoComponent;
  let fixture: ComponentFixture<Step3AutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3AutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3AutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
