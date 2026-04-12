import { Module } from '@nestjs/common';
import { ChangeHistoryService } from './change_history.service';
import { ChangeHistoryController } from './change_history.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService],
  exports: [ChangeHistoryService], // <-- ДОБАВИЛИ ЭКСПОРТ
})
export class ChangeHistoryModule {}