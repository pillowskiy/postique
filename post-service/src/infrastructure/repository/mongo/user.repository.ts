import { UserRepository } from '@/app/boundaries/repository/user.repository';
import { UserEntity } from '@/domain/user';
import { InjectModel, models } from '@/infrastructure/mongo';
import { Schemas } from '@/infrastructure/mongo/common/schema';
import { User } from '@/infrastructure/mongo/schemas';
import mongoose from 'mongoose';

export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(Schemas.Users) private readonly _userModel: models.UserModel,
  ) {
    super();
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this._userModel.findOne({ username });
    if (!user) {
      return null;
    }

    return this.#getUserEntity(user);
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await this._userModel.findById(id);
    if (!user) {
      return null;
    }

    return this.#getUserEntity(user);
  }

  #getUserEntity(user: User): UserEntity {
    const userEntity = UserEntity.create({
      id: user.id.toString(),
      username: user.username,
      avatarPath: user.avatarPath,
    });

    return userEntity;
  }
}
