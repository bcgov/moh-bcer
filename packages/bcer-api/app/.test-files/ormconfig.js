const { join } = require('path');

module.exports = [
  {
    name: process.env.DB_CONFIG_NAME || 'default',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5435,
    schema: process.env.DB_SCHEMA || 'bcer',
    username: process.env.DB_USERNAME || 'vape_nestapi',
    password: process.env.DB_PASSWORD || 'vape_nest123',
    database: process.env.DB_DATABASE || 'nest_api_test',
    entities: [__dirname + '/src/**/**.entity{.ts,.js}'],
    synchronize: false,
    dropSchema: true,

    migrations: ['migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
  },
];
