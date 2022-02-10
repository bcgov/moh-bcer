import { join } from 'path';

export const LOCAL_DB_CONFIG = {
    name: process.env.DB_CONFIG_NAME || 'default',
    type: process.env.DB_CONFIG_TYPE as any || 'postgres' as any,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5435,
    username: process.env.DB_USERNAME || 'vape_nestapi',
    password: process.env.DB_PASSWORD || 'vape_nest123',
    database: process.env.DB_DATABASE || 'nest_api_dev',
    entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
    synchronize: false,
    dropSchema: false,
    migrations: ['dist/migrations/**{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    keepConnectionAlive: true,
    logging: ['error', 'warn'] as any,
  }