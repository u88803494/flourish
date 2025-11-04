import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@flourish/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationBootstrap
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Failed to connect to database: ${message}`);
      throw new Error(`Database connection failed: ${message}`);
    }
  }

  async onApplicationBootstrap() {
    try {
      // Verify database connectivity with actual query
      await this.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database connectivity verified');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Database connectivity check failed: ${message}`);
      throw new Error(`Database is unreachable: ${message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('👋 Database disconnected');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error disconnecting database: ${message}`);
    }
  }
}
