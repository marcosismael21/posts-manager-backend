import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Posts Manager API')
    .setDescription('API para gestión de posts y comentarios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', apiReference({ spec: { content: document } }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
