import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, DbService],
})
export class PositionsModule {}