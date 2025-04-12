import { Controller } from '@nestjs/common';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import * as input from '@/app/boundaries/dto/input';
import { UserEvent } from './users.events';
import { UsersService } from './users.service';
import { UsersEventPattern } from '@/infrastructure/rabbitmq';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UsersEventPattern(UserEvent.Registered)
  async handleUserRegistered(
    @Payload() payload: input.SaveUserInput,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Received ${UserEvent.Registered} event`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const out = await this._usersService.saveUser(payload);
    console.log(`Result: `, out);
    channel.ack(originalMsg);
  }

  @UsersEventPattern(UserEvent.Profile)
  async handleUserProfileChanges(
    @Payload() payload: input.SaveUserInput,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Received ${UserEvent.Profile} event`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._usersService.saveUser(payload);
    channel.ack(originalMsg);
  }
}
