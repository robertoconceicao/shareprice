/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GeladasService } from './geladas.service';

describe('GeladasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeladasService]
    });
  });

  it('should ...', inject([GeladasService], (service: GeladasService) => {
    expect(service).toBeTruthy();
  }));
});
