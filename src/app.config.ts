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
  entities: [Countries, Holidays, Days, Max],
  synchronize: true,
  autoLoadEntities: true,
};
