import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoAnalysisComponent } from './po-analysis.component';

describe('PoAnalysisComponent', () => {
  let component: PoAnalysisComponent;
  let fixture: ComponentFixture<PoAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
