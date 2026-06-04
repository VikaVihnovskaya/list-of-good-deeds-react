import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<Deed[]> {
    return this.deedsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Deed> {
    const deed = await this.deedsRepository.findOne({ where: { id } });
    if (!deed) throw new NotFoundException(`Deed #${id} not found`);
    return deed;
  }

  create(dto: CreateDeedDto): Promise<Deed> {
    const deed = this.deedsRepository.create(dto);
    return this.deedsRepository.save(deed);
  }

  async update(id: number, dto: UpdateDeedDto): Promise<Deed> {
    const deed = await this.findOne(id);
    Object.assign(deed, dto);
    return this.deedsRepository.save(deed);
  }

  async remove(id: number): Promise<void> {
    const deed = await this.findOne(id);
    await this.deedsRepository.remove(deed);
  }
}
