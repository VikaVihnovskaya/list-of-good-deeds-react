import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  getFriends(@Req() req: any) {
    return this.friendsService.getFriends(req.user.id);
  }

  @Post()
  addFriend(@Body() dto: AddFriendDto, @Req() req: any) {
    return this.friendsService.addFriend(req.user.id, dto.tag);
  }

  @Delete(':friendId')
  removeFriend(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: any) {
    return this.friendsService.removeFriend(req.user.id, friendId);
  }

  @Get(':friendId/deeds')
  getFriendDeeds(@Param('friendId', ParseIntPipe) friendId: number, @Req() req: any) {
    return this.friendsService.getFriendDeeds(req.user.id, friendId);
  }
}
