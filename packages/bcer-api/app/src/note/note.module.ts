import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from 'src/business/business.module';
import { LocationModule } from 'src/location/location.module';
import { UserModule } from 'src/user/user.module';
import { NoteService } from './note.service';
import { NoteDataPortalController } from './noteDataPortal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    UserModule,
    forwardRef(() => LocationModule),
    BusinessModule,
  ],
  providers: [NoteService],
  controllers: [NoteDataPortalController],
})
export class NoteModule {}
