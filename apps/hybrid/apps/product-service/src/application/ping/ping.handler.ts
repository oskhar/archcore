import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PingCommand } from './ping.command';

@CommandHandler(PingCommand)
export class PingHandler implements ICommandHandler<PingCommand> {
  async execute(command: PingCommand): Promise<string> {
    return `Pong: ${command.message}`;
  }
}
