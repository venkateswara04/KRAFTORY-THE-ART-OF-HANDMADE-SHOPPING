import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisanProfileComponent } from './artisan-profile.component';

describe('ArtisanProfileComponent', () => {
  let component: ArtisanProfileComponent;
  let fixture: ComponentFixture<ArtisanProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisanProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtisanProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
