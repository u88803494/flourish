import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  getLiveness(): { status: string } {
    return {
      status: 'alive',
    };
  }

  async getReadiness(): Promise<{ status: string; ready: boolean }> {
    try {
      // Simple health check - database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        ready: true,
      };
    } catch (error) {
      return {
        status: 'not_ready',
        ready: false,
      };
    }
  }

  async getFullHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    database: {
      status: string;
      connected: boolean;
    };
  }> {
    let dbConnected = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (error) {
      dbConnected = false;
    }

    return {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
        connected: dbConnected,
      },
    };
  }
}
