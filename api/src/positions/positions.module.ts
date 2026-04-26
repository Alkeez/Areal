import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { DbModule } from '../db/db.module';
import { ChangeHistoryModule } from '../change_history/change_history.module';

@Module({
  imports: [DbModule, ChangeHistoryModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}