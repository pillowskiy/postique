import { UserEntity } from '@/domain/user';

export abstract class UsersRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByUsername(username: string): Promise<UserEntity | null>;
  abstract save(user: UserEntity): Promise<void>;
}
