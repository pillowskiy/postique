import { EntityFactory, IncomingEntity } from '../common/entity';
import { UserSchema } from './user.schema';

export class UserEntity {
  static create(user: IncomingEntity<UserEntity>): UserEntity {
    const validUser = EntityFactory.create(UserSchema, user);
    return new UserEntity(
      validUser.id,
      validUser.email,
      validUser.username,
      validUser.avatarPath,
    );
  }

  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly avatarPath: string = '',
  ) {}
}
