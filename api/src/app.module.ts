import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { PositionsModule } from './positions/positions.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [OrganizationsModule, PositionsModule, DepartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}