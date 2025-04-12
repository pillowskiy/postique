import { SaveUserInput } from '@/app/boundaries/dto/input';
import { SaveUserOutput } from '@/app/boundaries/dto/output';
import { SaveUserCommand } from '@/app/commands/user/save';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class UsersService {
  constructor(private readonly _commandBus: CommandBus) {}

  async saveUser(input: SaveUserInput): Promise<any> {
    return this._commandBus.execute<SaveUserCommand, SaveUserOutput>(
      new SaveUserCommand(input),
    );
  }
}
