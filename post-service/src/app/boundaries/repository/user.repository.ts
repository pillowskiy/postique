import { UserEntity } from '@/domain/user';

export abstract class UserRepository {
  abstract save(user: UserEntity): Promise<void>;
  abstract getByUsername(username: string): Promise<UserEntity | null>;
  abstract getById(id: string): Promise<UserEntity | null>;
  abstract getUnique(
    username: string,
    email: string,
  ): Promise<UserEntity | null>;
  abstract findManyUsers(ids: string[]): Promise<UserEntity[]>;
}
