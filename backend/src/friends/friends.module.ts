import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users/users.module';
import { DeedsModule } from '../deeds/deeds.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UsersModule, DeedsModule],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
