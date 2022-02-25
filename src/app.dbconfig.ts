import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Countries } from './enrico/entities/countries.entity';
import { Days } from './enrico/entities/days.entity';
import { Holidays } from './enrico/entities/holidays.entity';
import { Max } from './enrico/entities/max.entity';
export const Connection: TypeOrmModuleOptions = {
  url: process.env.DATABASE_URL,
  type: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  host: process.env.HOST,
  port: 5432,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: 'd6ruibk54lskah',
  entities: [Countries, Holidays, Days, Max],
  synchronize: true,
  autoLoadEntities: true,
};
