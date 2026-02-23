import { Controller, Get } from '@nestjs/common';

@Controller()
export class CheckController {
  @Get()
  check(): string {
    return 'Status OK';
  }
}
