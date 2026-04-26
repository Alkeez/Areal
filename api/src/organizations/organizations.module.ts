import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { DbModule } from '../db/db.module';
import { ChangeHistoryModule } from '../change_history/change_history.module';

@Module({
  imports: [DbModule, ChangeHistoryModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}