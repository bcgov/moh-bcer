const { DataSource } = require('typeorm');
const { join } = require('path');
require('dotenv').config();

// Both temporary until I get a migration script to run in 'prod'

let entities = [join(__dirname, 'src/**/**.entity{.ts,.js}')];
if (['development', 'test', 'production'].includes(process.env.NODE_ENV)) { entities = ['**/**.entity{.ts,.js}']; }
if (process.env.AWS_ENV === 'true') { entities = [join(__dirname, 'dist/**/**.entity{.ts,.js}')]; }
const synchronize = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;
const dropSchema = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;

const AppDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  entities: entities,
  synchronize: synchronize,
  dropSchema: dropSchema,
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations'
  }
});

module.exports = AppDataSource;