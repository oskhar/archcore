import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'up',
      service: 'monolith',
      version: '1.0.0',
      architecture: 'monolith',
      features: {
        kafka: false,
      },
    };
  }
}
