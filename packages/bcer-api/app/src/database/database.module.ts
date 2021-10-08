import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { LOCAL_DB_CONFIG } from './local-db-config.entity';

console.log(LOCAL_DB_CONFIG)
@Module({
  imports: [
    TypeOrmModule.forRoot(process.env.NODE_ENV ==='development' ? LOCAL_DB_CONFIG : {})
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}