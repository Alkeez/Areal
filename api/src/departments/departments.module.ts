import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DbService],
})
export class DepartmentsModule {}