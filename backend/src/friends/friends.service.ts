import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UsersService } from '../users/users.service';
import { DeedsService } from '../deeds/deeds.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly usersService: UsersService,
    private readonly deedsService: DeedsService,
  ) {}

  async addFriend(userId: number, tag: string) {
    const friend = await this.usersService.findByTag(tag);
    if (!friend) throw new NotFoundException(`User @${tag} not found`);
    if (friend.id === userId) throw new BadRequestException('You cannot add yourself');

    const exists = await this.friendsRepository.findOne({
      where: { userId, friendId: friend.id },
    });
    if (exists) throw new ConflictException('Already in your friends');

    await this.friendsRepository.save(
      this.friendsRepository.create({ userId, friendId: friend.id }),
    );
    return { id: friend.id, name: friend.name, tag: friend.tag, email: friend.email };
  }

  async getFriends(userId: number) {
    const links = await this.friendsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    if (links.length === 0) return [];

    const friendIds = links.map((l) => l.friendId);
    const users = await this.usersService.findByIds(friendIds);
    return users.map((u) => ({ id: u.id, name: u.name, tag: u.tag, email: u.email }));
  }

  async removeFriend(userId: number, friendId: number) {
    const link = await this.friendsRepository.findOne({
      where: { userId, friendId },
    });
    if (!link) throw new NotFoundException('Friend not found');
    await this.friendsRepository.remove(link);
  }

  async getFriendDeeds(userId: number, friendId: number) {
    const link = await this.friendsRepository.findOne({
      where: { userId, friendId },
    });
    if (!link) throw new ForbiddenException('This user is not in your friends');
    return this.deedsService.findAll(friendId);
  }
}
