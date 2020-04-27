import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainsightComponent } from './plainsight.component';

describe('PlainsightComponent', () => {
  let component: PlainsightComponent;
  let fixture: ComponentFixture<PlainsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlainsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
