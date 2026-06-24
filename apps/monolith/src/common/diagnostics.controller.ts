import { Controller, Get } from '@nestjs/common';

@Controller('diagnostics')
export class DiagnosticsController {
  @Get('ping')
  ping() {
    return {
      status: 'ok',
      receivedAt: new Date().toISOString(),
      source: 'monolith',
    };
  }
}
