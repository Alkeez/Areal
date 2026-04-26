import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DbModule } from '../db/db.module';
import { ChangeHistoryModule } from '../change_history/change_history.module';

@Module({
  imports: [DbModule, ChangeHistoryModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}