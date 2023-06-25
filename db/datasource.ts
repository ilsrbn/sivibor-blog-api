import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.MYSQL_USERNAME || 'admin';
const PASSWORD = process.env.MYSQL_PASSWORD || 'admin';
const DATABASE = process.env.MYSQL_DATABASE || 'admin';
const DB_TYPE = process.env.MYSQL_DATABASE_TYPE || 'mysql';

export const dataSourceOptions: DataSourceOptions = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  type: DB_TYPE,
  host: '127.0.0.1',
  port: 3306,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
