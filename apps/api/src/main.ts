import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable compression middleware for all responses
  app.use(compression());

  // Enable CORS for frontend apps
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const corsOrigins = corsOrigin?.split(',') || [];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 6888;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();
