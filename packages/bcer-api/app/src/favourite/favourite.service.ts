import { Injectable } from '@nestjs/common';
import { FavouriteDto } from './dto/favourite.dto';
import { FavouriteEntity } from './entities/favourite.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class FavouriteService {

  constructor (
    @InjectRepository(FavouriteEntity) private favouriteRepository: Repository<FavouriteEntity>,
  ){}
  
  async create(user: UserEntity, favouriteDto: FavouriteDto) {  
    const favourite = this.favouriteRepository.create({
      user,
      ...favouriteDto,
    });

    await this.favouriteRepository.save(favourite);
  }

  async findByUser(user: UserEntity) {
    return await this.favouriteRepository.find({
                  where: {
                    user
                  }
                })
  }

  async findOne(id: string) {
    return await this.favouriteRepository.findOne(id)
  }

  async remove(id: string) {
    await this.favouriteRepository.delete(id);
  }
}