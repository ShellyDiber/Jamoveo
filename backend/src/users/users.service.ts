import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { username: createUserDto.username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashed,  // we save the hashed password
      role: createUserDto.role || 'player', // default to 'player' if not provided
    });
    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepo.findOne({ where: { username } });
    return user === null ? undefined : user;
  }


}
