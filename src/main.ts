import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('MediaPark Node Task')
    .setDescription(
      'The Node Task API has get requests, when using any of these get requests (except default one (/)), the data if it doesnt exist in database will be pulled from <a href= "https://kayaposoft.com/enrico/">Enrico</a> and put into postgresSQL database, otherwise it will be taken from database. Code is uploaded to <a href= "https://github.com/G-Ruslanas/Node_Task">GitHub</a>',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
