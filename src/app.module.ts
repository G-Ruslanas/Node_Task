import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './app.dbconfig';
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
