import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeedsController } from './deeds.controller';
import { DeedsService } from './deeds.service';
import { Deed } from './deeds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deed])],
  controllers: [DeedsController],
  providers: [DeedsService],
})
export class DeedsModule {}
