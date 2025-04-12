import { CommandHandler } from '@nestjs/cqrs';
import { SaveUserOutput } from '@/app/boundaries/dto/output';
import { Command } from '../../common';
import { SaveUserCommand } from './save-user.command';
import { Inject } from '@nestjs/common';
import { UsersRepository } from '@/app/boundaries/repository';
import { ConflictException } from '@/app/boundaries/errors';
import { UserEntity } from '@/domain/user';

@CommandHandler(SaveUserCommand)
export class SaveUserCommandHandler extends Command<
  SaveUserCommand,
  SaveUserOutput
> {
  @Inject(UsersRepository)
  private readonly _usersRepository: UsersRepository;

  protected async invoke(input: SaveUserCommand): Promise<SaveUserOutput> {
    const user = UserEntity.create({
      id: input.id,
      username: input.username,
      email: input.email,
      avatarPath: input.avatarPath,
    });

    const storedUser = await this._usersRepository.findUnique(
      user.username,
      user.email,
    );

    if (storedUser && storedUser.id !== user.id) {
      throw new ConflictException('User with that username already exists');
    }

    await this._usersRepository.save(user);

    return new SaveUserOutput(user.id);
  }
}
