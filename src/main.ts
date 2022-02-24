import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('MediaPark Node Task')
    .setDescription(
      'The Node Task API has get requests, when using any of these get requests, the data if it doesnt exist in database will be pulled from <a href= "enrico">https://kayaposoft.com/enrico/</a> and put into postgresSQL database. Code is uploaded to Github',
    )
    .setVersion('1.0')
    .addTag('node task')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
