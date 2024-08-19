"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = require("path");
let entities = [(0, path_1.join)(__dirname, 'src/**/**.entity{.ts,.js}')];
if (['development', 'test', 'production'].includes(process.env.NODE_ENV)) {
    entities = ['src/**/**.entity{.ts,.js}'];
}
if (process.env.AWS_ENV === 'true') {
    entities = [(0, path_1.join)(__dirname, 'dist/src/**/**.entity{.ts,.js}')];
}
const synchronize = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;
const dropSchema = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;
exports.dataSource = new typeorm_1.DataSource({
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
    migrations: [(0, path_1.join)(__dirname, 'src/migrations/*{.ts,.js}')],
    migrationsRun: true,
});
//# sourceMappingURL=datasource.js.map