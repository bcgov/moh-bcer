import { DataSource } from 'typeorm';
import { join } from 'path';
import * as path from 'path';
import * as dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

let entities: string[] = [join(__dirname, '**/**.entity{.ts,.js}')];
if (['development', 'test', 'production'].includes(process.env.NODE_ENV)) {entities = ['**/**.entity{.ts,.js}'];}
if (process.env.AWS_ENV === 'true') {entities = [join(__dirname, '../dist/src/**/**.entity{.ts,.js}')];}

const synchronize: boolean = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;
const dropSchema: boolean = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;

export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: entities,
  synchronize: synchronize,
  dropSchema: dropSchema,
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  migrationsRun: true,
});