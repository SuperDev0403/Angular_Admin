import { TestBed } from '@angular/core/testing';

import { BoardfyService } from './boardfy.service';

describe('BoardfyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardfyService = TestBed.get(BoardfyService);
    expect(service).toBeTruthy();
  });
});
