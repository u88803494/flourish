import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  async getLiveness(): Promise<{ status: string }> {
    return this.healthService.getLiveness();
  }

  @Get('readiness')
  async getReadiness(): Promise<{ status: string; ready: boolean }> {
    return this.healthService.getReadiness();
  }

  @Get()
  async getHealth() {
    return this.healthService.getFullHealth();
  }
}
