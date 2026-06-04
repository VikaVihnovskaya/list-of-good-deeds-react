import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Get()
  findAll() {
    return this.deedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deedsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDeedDto) {
    return this.deedsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeedDto) {
    return this.deedsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deedsService.remove(id);
  }
}
