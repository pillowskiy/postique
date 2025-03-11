import { EntityFactory } from '../../common/entity';
import { IncomingUser, IUser } from './user.interface';
import { UserSchema } from './user.schema';

export class User implements IUser {
  static create(user: IncomingUser): User {
    const validUser = EntityFactory.create(UserSchema, user);
    return new User(validUser);
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
