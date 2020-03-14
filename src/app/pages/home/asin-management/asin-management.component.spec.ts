import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsinManagementComponent } from './asin-management.component';

describe('AsinManagementComponent', () => {
  let component: AsinManagementComponent;
  let fixture: ComponentFixture<AsinManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsinManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsinManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
