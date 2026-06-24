import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'up',
      service: 'api-gateway',
      version: '1.0.0',
      architecture: 'hybrid',
      features: {
        kafka: true,
      },
    };
  }
}
