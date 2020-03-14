import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoRejectionComponent } from './po-rejection.component';

describe('PoRejectionComponent', () => {
  let component: PoRejectionComponent;
  let fixture: ComponentFixture<PoRejectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoRejectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRejectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
