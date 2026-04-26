import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateUserDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateUserDto>) { return this.service.update(id, dto); }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}