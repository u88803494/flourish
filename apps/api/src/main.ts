// Load environment variables from root .env before any other imports
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:3000', // Flow
      'http://localhost:3100', // Apex
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 6888;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();
