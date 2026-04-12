import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { DbModule } from '../db/db.module';
import { ChangeHistoryModule } from '../change_history/change_history.module'; // Импорт

@Module({
  imports: [DbModule, ChangeHistoryModule], // Импортируем
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}