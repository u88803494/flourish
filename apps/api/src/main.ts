import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for frontend apps
  const corsOrigins = configService.get<string>('CORS_ORIGIN').split(',');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = configService.get<number>('PORT');
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();
