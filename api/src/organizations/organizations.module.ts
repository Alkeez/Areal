import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, DbService],
})
export class OrganizationsModule {}