import { Module } from '@nestjs/common';
import { HrOperationsController } from './hr_operations.controller';
import { HrOperationsService } from './hr_operations.service';

@Module({
  controllers: [HrOperationsController],
  providers: [HrOperationsService]
})
export class HrOperationsModule {}
