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
  const corsOrigins = corsOrigin?.split(',').map((origin) => origin.trim()) || [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches any of the allowed patterns
      const isAllowed = corsOrigins.some((allowedOrigin) => {
        // Convert wildcard pattern to regex
        const pattern = allowedOrigin
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
          .replace(/\*/g, '.*'); // Convert * to .*
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 6888;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();
