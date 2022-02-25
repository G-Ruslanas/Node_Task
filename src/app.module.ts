import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnricoModule } from './enrico/enrico.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EnricoModule,
    TypeOrmModule.forRoot(Connection),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5433,
//       username: 'user',
//       password: '4a6d8s3j',
//       database: 'MediaPark_Task',
//       entities: [Countries, Holidays, Days, Max],
//       synchronize: true,
//     }),
