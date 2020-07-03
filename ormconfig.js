/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

const isTestMode = process.env.NODE_ENV === 'test';

const entities = [resolve(__dirname, 'dist', '**', 'entities', '*.entity.js')];
const migrations = [
  resolve(__dirname, 'dist', 'database', 'migrations', '*.js'),
];

if (isTestMode) {
  entities.push(resolve(__dirname, 'src', '**', 'entities', '*.entity.ts'));
  migrations.push(resolve(__dirname, 'src', 'database', 'migrations', '*.ts'));
}

module.exports = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: isTestMode,
  entities,
  migrations,
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
  },
};
