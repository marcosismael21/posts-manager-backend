import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { DateFormatInterceptor } from './common/interceptors/date-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new DateFormatInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Posts Manager API')
    .setDescription('API para gestión de posts y comentarios')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (document.tags) {
    document.tags.sort((a, b) => a.name.localeCompare(b.name));
  }
  document.paths = Object.fromEntries(
    Object.entries(document.paths ?? {}).sort(([a], [b]) => a.localeCompare(b)),
  );

  app.use('/docs', apiReference({ spec: { content: document } }));
  app.use('/docs-json', (_req: any, res: any) => res.json(document));

  app.enableCors({ origin: 'http://localhost:4200' });

  app.getHttpAdapter().getInstance().set('etag', false);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
