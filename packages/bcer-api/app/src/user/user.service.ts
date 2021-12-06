import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { UserRO } from './ro/user.ro';
import { UserTypeEnum } from './enums/user-type.enum';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { UserSearchDTO } from './dto/user-search.dto';
import { UserSearchTypes } from './enums/user-search-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAllUsers(): Promise<UserRO[]> {
    const users = await this.userRepository.find();
    return users.map(user => user.toResponseObject());
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
    const user = await this.userRepository.findOne({ bceid });
    return user;
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...data,
      type: UserTypeEnum[data.type],
    });
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

  async getUsersWithBusinessData(
    query: UserSearchDTO,
  ): Promise<Array<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.business', 'business')
      .where('user.type = :type', { type: UserTypeEnum.BUSINESS_OWNER });

    if (query?.search) {
      const search = `%${query.search.toLowerCase()}%`;
      switch (query.type) {
        // May be we could use ILIKE instead of like after confirming the postgres version?
        case UserSearchTypes.UserName:
          queryBuilder.andWhere(
            'LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search',
            { search },
          );
          break;
        case UserSearchTypes.BusinessName:
          queryBuilder.andWhere(
            'LOWER(business.businessName) LIKE :search OR LOWER(business.legalName) LIKE :search',
            { search },
          );
          break;
        case UserSearchTypes.Address:
          queryBuilder.andWhere(
            `LOWER(business.addressLine1) LIKE :search 
            OR LOWER(business.addressLine2) LIKE :search 
            OR LOWER(business.city) LIKE :search 
            OR LOWER(business.postal) LIKE :search`,
            { search },
          );
          break;
        case UserSearchTypes.emailAddress:
          queryBuilder.andWhere(
            'LOWER(user.email) LIKE :search OR LOWER(business.email) LIKE :search',
            { search },
          );
      }
    }

    queryBuilder.orderBy('user.firstName', 'ASC');

    const users = await queryBuilder.getMany();

    return users;
  }

  async assignBusinessToUser(userId: string, businessId){
    await this.update({id: userId, businessId});
  }
}
