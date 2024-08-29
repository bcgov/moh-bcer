import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { LOCAL_DB_CONFIG } from './local-db-config.entity';
import AppDataSource from './../../datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const isLocalDev = process.env.NODE_ENV === 'local-dev';
        return isLocalDev ? LOCAL_DB_CONFIG : AppDataSource.options;
      },
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}