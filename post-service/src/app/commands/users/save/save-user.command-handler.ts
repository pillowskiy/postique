import { CommandHandler } from '@nestjs/cqrs';
import { SaveUserOutput } from '@/app/boundaries/dto/output';
import { Command } from '../../common';
import { SaveUserCommand } from './save-user.command';
import { Inject } from '@nestjs/common';
import { UserRepository } from '@/app/boundaries/repository';
import { ConflictException } from '@/app/boundaries/errors';
import { UserEntity } from '@/domain/user';
import { Logger } from '@/app/boundaries/common';

@CommandHandler(SaveUserCommand)
export class SaveUserCommandHandler extends Command<
  SaveUserCommand,
  SaveUserOutput
> {
  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(Logger)
  private readonly _logger: Logger;

  protected async invoke(input: SaveUserCommand): Promise<SaveUserOutput> {
    this._logger.debug?.('Saving user %o', { user: input });

    const user = UserEntity.create({
      id: input.id,
      username: input.username,
      email: input.email,
      avatarPath: input.avatarPath,
    });

    const storedUser = await this._userRepository.getUnique(
      user.username,
      user.email,
    );

    if (storedUser) {
      this._logger.debug?.('Found unique user');
    }

    if (storedUser && storedUser.id !== user.id) {
      throw new ConflictException('User with that username already exists');
    }

    await this._userRepository.save(user);
    this._logger.debug?.('User saved successfully');

    return new SaveUserOutput(user.id);
  }
}
