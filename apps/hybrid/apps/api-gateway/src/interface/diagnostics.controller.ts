import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('diagnostics')
export class DiagnosticsController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('health-ping');
    await this.client.connect();
  }

  @Get('ping')
  ping() {
    return this.client.send('health-ping', { timestamp: new Date() });
  }
}
