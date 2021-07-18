const isTest = process.env.NODE_ENV === 'test';

const dotenv = require(__dirname +
  (isTest ? '' : '/dist') +
  '/src/lib/dotenv').default;

dotenv.config();

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_DATABASE || 'finansist',
  entities: [__dirname + (isTest ? '' : '/dist') + '/src/**/*.entity.{js,ts}'],
  migrations: [__dirname + (isTest ? '' : '/dist') + '/migrations/*.{js,ts}'],
  dropSchema: isTest,
  migrationsRun: isTest,
  cli: {
    migrationsDir: 'migrations',
  },
};
