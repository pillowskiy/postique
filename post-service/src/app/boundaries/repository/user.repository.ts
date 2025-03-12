import { UserEntity } from '@/domain/user';

export abstract class UserRepository {
  abstract getByUsername(username: string): Promise<UserEntity | null>;
  abstract getById(id: string): Promise<UserEntity | null>;
}
