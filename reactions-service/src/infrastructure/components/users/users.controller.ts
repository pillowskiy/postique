import { Controller } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import * as input from '@/app/boundaries/dto/input';
import { UsersEvents } from './users.events';
import { UsersService } from './users.service';
import { UsersEventPattern } from '@/infrastructure/rabbitmq';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UsersEventPattern(UsersEvents.Registered)
  async handleUserRegistered(
    @Payload() payload: input.SaveUserInput,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._usersService.saveUser(payload);
    channel.ack(originalMsg);
  }

  @UsersEventPattern(UsersEvents.Profile)
  async handleUserProfileChanges(
    @Payload() payload: input.SaveUserInput,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._usersService.saveUser(payload);
    channel.ack(originalMsg);
  }
}
