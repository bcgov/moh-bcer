import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturingController } from 'src/manufacturing/manufacturing.controller';

describe('Manufacturing Controller', () => {
  let controller: ManufacturingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturingController],
    }).compile();

    controller = module.get<ManufacturingController>(ManufacturingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
