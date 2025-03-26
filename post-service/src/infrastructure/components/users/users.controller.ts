import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserEvent } from './common';
import { UsersService } from './users.service';
import * as input from '@/app/boundaries/dto/input';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @EventPattern(UserEvent.Registered)
  async handleUserRegistered(
    @Payload() payload: input.SaveUserInput,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._usersService.saveUser(payload);
    channel.ack(originalMsg);
  }

  @EventPattern(UserEvent.Profile)
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
