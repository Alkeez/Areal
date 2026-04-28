import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ChangeHistoryService } from './change_history.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@Controller('change_history')
export class ChangeHistoryController {
  constructor(private readonly service: ChangeHistoryService) {}

  @Post()
  create(@Body() dto: CreateChangeHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('type') type?: string, @Query('id') id?: string) {
    return this.service.findAll(type, id ? parseInt(id) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}