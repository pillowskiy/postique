import { UserEntity } from '@/domain/user';
import { UserOutput } from '../dto/output';

export class UserMapper {
  static toDto(user: UserEntity): UserOutput {
    return new UserOutput(user.id, user.username, user.email, user.avatarPath);
  }
}
