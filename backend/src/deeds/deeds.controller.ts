import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { DeedsService } from './deeds.service';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('deeds')
export class DeedsController {
  constructor(private readonly deedsService: DeedsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.deedsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.deedsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateDeedDto, @Req() req: any) {
    return this.deedsService.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeedDto, @Req() req: any) {
    return this.deedsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.deedsService.remove(id, req.user.id);
  }
}
