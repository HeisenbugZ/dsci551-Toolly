import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { stringify } from 'yaml';

import { useContainer } from 'class-validator';
import { Config } from 'config/config';
import { Connection } from 'typeorm';
import { AppModule } from './app.module';
import { generateMigration } from './utils/generateMigration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  if (process.env.GEN_MIGRATION) {
    const connection = app.get(Connection);

    await generateMigration(connection, process.env.GEN_MIGRATION);
    return;
  }

  if (process.env.MIGRATE) {
    const connection = app.get(Connection);

    Logger.log(`process.env.MIGRATE is set, migrating...`);
    const migrations = await connection.runMigrations();

    if (migrations.length === 0) {
      Logger.warn(`Your database is up-to-date, no migrations were applied. `);
    } else {
      Logger.log(`${migrations.length} complete.`);
    }
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Toolly')
    .setDescription('The toolly API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  app.getHttpAdapter().get('/swagger-yaml', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.send(stringify(swaggerDocument));
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setGlobalPrefix('/api');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = (app.get(ConfigService) as ConfigService<Config>).get(
    'PORT',
  ) as number;
  await app.listen(port);

  Logger.log(`toolly - listening on http://localhost:${port}`);
}

bootstrap();
