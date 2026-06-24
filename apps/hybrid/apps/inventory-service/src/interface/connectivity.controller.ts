import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ConnectivityController {
  @MessagePattern('health-ping')
  handlePing(@Payload() data: any) {
    console.log('[Inventory] Received ping:', data);
    return { status: 'ok', receivedAt: new Date() };
  }
}
