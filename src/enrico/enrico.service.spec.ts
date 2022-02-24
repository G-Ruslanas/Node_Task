import { Test, TestingModule } from '@nestjs/testing';
import { EnricoService } from './enrico.service';

describe('EnricoService', () => {
  let service: EnricoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnricoService],
    }).compile();

    service = module.get<EnricoService>(EnricoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
