import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnricoModule } from './enrico/enrico.module';
import { Countries } from './enrico/entities/countries.entity';
import { Days } from './enrico/entities/days.entity';
import { Holidays } from './enrico/entities/holidays.entity';
import { Max } from './enrico/entities/max.entity';

@Module({
  imports: [
    EnricoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'user',
      password: '4a6d8s3j',
      database: 'MediaPark_Task',
      entities: [Countries, Holidays, Days, Max],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
