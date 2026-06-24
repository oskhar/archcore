import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'up',
      service: 'product-service',
      version: '1.0.0',
      architecture: 'hybrid',
      features: {
        cqrs: true,
        eventSourcing: true,
        kafka: true,
      },
    };
  }
}
