import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { UserRO } from './ro/user.ro';
import { UserTypeEnum } from './enums/user-type.enum'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findAllUsers(): Promise<UserRO[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponseObject());
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id });
    return user;
  }

  async findByBCeID(bceid) {
    const user = await this.userRepository.findOne({ bceid })
    return user;
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create({ ...data, type: UserTypeEnum[data.type]});
    await this.userRepository.save(user);
    return user;
  }

  async update(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.save(data);
    return user;
  }

  async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
