import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<{ message: string; dbStatus: string }> {
    try {
      // Test database connection by running a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        message: 'Hello from Flourish API! 🌸',
        dbStatus: 'connected ✅',
      };
    } catch (error) {
      return {
        message: 'Hello from Flourish API! 🌸',
        dbStatus: 'disconnected ❌',
      };
    }
  }
}
