import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnricoController } from './enrico.controller';
import { EnricoService } from './enrico.service';
import { Countries } from './entities/countries.entity';
import { Days } from './entities/days.entity';
import { Holidays } from './entities/holidays.entity';
import { Max } from './entities/max.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries, Holidays, Days, Max])],
  controllers: [EnricoController],
  providers: [EnricoService],
})
export class EnricoModule {}
