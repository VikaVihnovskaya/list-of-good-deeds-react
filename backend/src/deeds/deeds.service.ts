import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deed } from './deeds.entity';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';

@Injectable()
export class DeedsService {
  constructor(
    @InjectRepository(Deed)
    private readonly deedsRepository: Repository<Deed>,
  ) {}

  findAll(userId: number): Promise<Deed[]> {
    return this.deedsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Deed> {
    const deed = await this.deedsRepository.findOne({ where: { id } });
    if (!deed) throw new NotFoundException(`Deed #${id} not found`);
    if (deed.userId !== userId) throw new ForbiddenException();
    return deed;
  }

  create(dto: CreateDeedDto, userId: number): Promise<Deed> {
    const deed = this.deedsRepository.create({ ...dto, userId });
    return this.deedsRepository.save(deed);
  }

  async update(id: number, dto: UpdateDeedDto, userId: number): Promise<Deed> {
    const deed = await this.findOne(id, userId);
    Object.assign(deed, dto);
    return this.deedsRepository.save(deed);
  }

  async remove(id: number, userId: number): Promise<void> {
    const deed = await this.findOne(id, userId);
    await this.deedsRepository.remove(deed);
  }
}
