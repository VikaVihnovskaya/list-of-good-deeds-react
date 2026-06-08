import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.signToken(user.id, user.email, user.name, user.tag);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user.id, user.email, user.name, user.tag);
  }

  async getProfile(userId: number) {
    const { password, ...user } = await this.usersService.findById(userId);
    return user;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const { password, ...user } = await this.usersService.update(userId, dto);
    return user;
  }

  async deleteProfile(userId: number) {
    return this.usersService.remove(userId);
  }

  private signToken(sub: number, email: string, name: string, tag: string) {
    return { access_token: this.jwtService.sign({ sub, email, name, tag }) };
  }
}
