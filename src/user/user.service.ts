import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getOrCreateUserByTgId(userDto: UserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({
      telegramId: userDto.telegramId,
    });
    if (!user) {
      const user = new User();
      user.telegramId = userDto.telegramId;
      user.firstName = userDto.firstName;
      user.lastName = userDto.lastName;
      user.username = userDto.username;
      user.createdAt = new Date();

      return this.userRepository.save(user);
    }
    return user;
  }
}
