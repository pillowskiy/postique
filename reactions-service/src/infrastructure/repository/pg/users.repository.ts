import { Transactional } from '@/app/boundaries/common';
import { UsersRepository } from '@/app/boundaries/repository';
import { UserEntity } from '@/domain/user';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { users } from '@/infrastructure/drizzle/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';

@Injectable()
export class PostgresUsersRepository extends UsersRepository {
  @Inject(Transactional)
  private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<UserEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async save(user: UserEntity): Promise<void> {
    await this._txHost.exec
      .insert(users)
      .values({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarPath: user.avatarPath,
      })
      .onConflictDoUpdate({
        target: [users.id],
        set: {
          username: user.username,
          email: user.email,
          avatarPath: user.avatarPath,
        },
      });
  }

  #toEntity(result: InferSelectModel<typeof users>): UserEntity {
    return UserEntity.create({
      id: result.id,
      username: result.username,
      email: result.email,
      avatarPath: result.avatarPath ?? '',
    });
  }
}
