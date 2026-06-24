import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PingCommand } from '../application/ping/ping.command';

@Controller('ping')
export class PingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  async ping(@Query('msg') message: string = 'Hello') {
    return this.commandBus.execute(new PingCommand(message));
  }
}
