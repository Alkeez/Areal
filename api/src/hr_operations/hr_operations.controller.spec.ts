import { Test, TestingModule } from '@nestjs/testing';
import { HrOperationsController } from './hr_operations.controller';

describe('HrOperationsController', () => {
  let controller: HrOperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrOperationsController],
    }).compile();

    controller = module.get<HrOperationsController>(HrOperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
