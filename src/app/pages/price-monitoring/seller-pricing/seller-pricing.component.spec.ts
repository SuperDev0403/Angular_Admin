import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerPricingComponent } from './seller-pricing.component';

describe('SellerPricingComponent', () => {
  let component: SellerPricingComponent;
  let fixture: ComponentFixture<SellerPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
