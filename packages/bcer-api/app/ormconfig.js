const crypto = require('crypto');
const IV = '962d7949d38e6f1e';
const SALT = 'fc1cadcfa5fd2623113b0e256b799710';
const ALGO = 'aes-256-cbc';

// Both temporary until I get a migration script to run in 'prod'
let entities = [__dirname + '/src/**/**.entity{.ts,.js}'];
if (['development', 'test', 'production'].includes(process.env.NODE_ENV)) { entities = ['**/**.entity{.ts,.js}']; }
if (process.env.AWS_ENV === 'true') { entities = [__dirname + '/dist/**/**.entity{.ts,.js}'] };

const synchronize = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;
const dropSchema = (['internal', 'docker'].includes(process.env.NODE_ENV)) ? true : false;

//const decipher = crypto.createDecipheriv(ALGO, SALT, IV);
//const decryptedDbPw = process.env.DB_PASSWORD ? Buffer.concat([decipher.update(Buffer.from(process.env.DB_PASSWORD, 'hex')), decipher.final()]).toString() : '';

module.exports = [
  {
    'name': 'default',
    'type': 'postgres',
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'schema': process.env.DB_SCHEMA,
    'username': process.env.DB_USERNAME,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_DATABASE,
    'entities': entities,
    'synchronize': synchronize,
    'dropSchema': dropSchema,
    'migrations': ['dist/migrations/*{.ts,.js}'],
    'cli': {
      'migrationsDir':'src/migrations'
    }
  }
]
