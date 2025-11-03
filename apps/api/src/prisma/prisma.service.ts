import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@flourish/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Database connected');
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
