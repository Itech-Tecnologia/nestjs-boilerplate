import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { UI } from 'bull-board';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { strategy: 'excludeAll' },
  });
  app.useGlobalPipes(validationPipe);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  if (configService.get('NODE_ENV') === 'development') {
    app.use('/queue', UI);

    const swaggerOptions = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('NestJS Boilerplate')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('api/swagger', app, document);
  }

  await app.listen(port);
}

bootstrap();
