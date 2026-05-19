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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ spec: { content: document } }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
