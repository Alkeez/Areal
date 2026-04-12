import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ChangeHistoryService } from './change_history.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';

@Controller('change_history')
export class ChangeHistoryController {
  constructor(private readonly service: ChangeHistoryService) {}

  @Post()
  create(@Body() dto: CreateChangeHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}