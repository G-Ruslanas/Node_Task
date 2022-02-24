import { Test, TestingModule } from '@nestjs/testing';
import { EnricoController } from './enrico.controller';

describe('EnricoController', () => {
  let controller: EnricoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnricoController],
    }).compile();

    controller = module.get<EnricoController>(EnricoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
