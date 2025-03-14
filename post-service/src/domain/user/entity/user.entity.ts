import { EntityFactory } from '../../common/entity';
import { IncomingUser, IUser } from './user.interface';
import { UserSchema } from './user.schema';

export class UserEntity implements IUser {
  static create(user: IncomingUser): UserEntity {
    const validUser = EntityFactory.create(UserSchema, user);
    return new UserEntity(validUser);
  }

  public readonly id: string;
  public readonly username: string;
  public readonly avatarPath: string;

  private constructor({ id, username, avatarPath }: IUser) {
    this.id = id;
    this.username = username;
    this.avatarPath = avatarPath;
  }
}
