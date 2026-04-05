import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module'; // Импортируем глобальный модуль
import { OrganizationsModule } from './organizations/organizations.module';
import { PositionsModule } from './positions/positions.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { FilesModule } from './files/files.module';
import { HrOperationsModule } from './hr_operations/hr_operations.module';
import { ChangeHistoryModule } from './change_history/change_history.module';

@Module({
  imports: [DbModule, OrganizationsModule, PositionsModule, DepartmentsModule, EmployeesModule, FilesModule, HrOperationsModule, ChangeHistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}