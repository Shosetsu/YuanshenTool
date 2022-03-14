import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTodayComponent } from './random-today.component';

describe('RandomTodayComponent', () => {
  let component: RandomTodayComponent;
  let fixture: ComponentFixture<RandomTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTodayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
