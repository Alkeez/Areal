import { Module } from '@nestjs/common';
import { ChangeHistoryController } from './change_history.controller';
import { ChangeHistoryService } from './change_history.service';

@Module({
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService]
})
export class ChangeHistoryModule {}
