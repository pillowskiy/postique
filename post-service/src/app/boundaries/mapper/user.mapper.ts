import { UserEntity } from '@/domain/user';
import { User } from '../dto/output';

export class UserMapper {
  static toDto(user: UserEntity): User {
    return new User(user.id, user.username, user.email, user.avatarPath);
  }
}
