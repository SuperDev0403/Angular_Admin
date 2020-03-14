import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandReputationComponent } from './brand-reputation.component';

describe('BrandReputationComponent', () => {
  let component: BrandReputationComponent;
  let fixture: ComponentFixture<BrandReputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandReputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandReputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
