const { DataSource } = require('typeorm');
const { join } = require('path');
require('dotenv').config();

const AppDataSource = new DataSource({
  name: process.env.DB_CONFIG_NAME || 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5435,
  schema: process.env.DB_SCHEMA || 'bcer',
  username: process.env.DB_USERNAME || 'vape_nestapi',
  password: process.env.DB_PASSWORD || 'vape_nest123',
  database: process.env.DB_DATABASE || 'nest_api_test',
  entities: [join(__dirname, 'dist/**/**.entity.js')],
  synchronize: false,
  dropSchema: true,
  // migrations: ['migrations/*{.ts,.js}'],
  migrations: [join(__dirname, 'dist/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
});

module.exports = AppDataSource;