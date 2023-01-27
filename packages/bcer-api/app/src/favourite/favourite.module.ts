import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteDataPortalController } from './favouriteDataPortal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouriteEntity } from './entities/favourite.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavouriteEntity]),
    UserModule,
  ],
  controllers: [FavouriteDataPortalController],
  providers: [FavouriteService],
  exports: [FavouriteService],
})
export class FavouriteModule {}