import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module'; // Импортируем глобальный модуль
import { OrganizationsModule } from './organizations/organizations.module';
import { PositionsModule } from './positions/positions.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [DbModule, OrganizationsModule, PositionsModule, DepartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}