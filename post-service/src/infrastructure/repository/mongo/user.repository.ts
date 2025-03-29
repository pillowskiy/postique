import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import { UserRepository } from '@/app/boundaries/repository';
import { IUser, UserEntity } from '@/domain/user';
import {
  InjectModel,
  MongoTransactional,
  Schemas,
  models,
} from '@/infrastructure/database/mongo';
import { User } from '@/infrastructure/database/mongo/schemas';

@Injectable()
export class MongoUserRepository extends UserRepository {
  @Inject(Transactional)
  private readonly _transactional: MongoTransactional;

  @InjectModel(Schemas.Users) private readonly _userModel: models.UserModel;

  async save(user: UserEntity): Promise<void> {
    await this._userModel.updateOne(
      { _id: user.id },
      { $set: this._getUserFields(user) },
      { upsert: true, session: this._transactional.getSession(undefined) },
    );
  }

  async getUnique(username: string, email: string): Promise<UserEntity | null> {
    const user = await this._userModel
      .findOne({ username, email })
      .session(this._transactional.getSession(null))
      .lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this._userModel
      .findOne({ username })
      .session(this._transactional.getSession(null))
      .lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await this._userModel
      .findById(id)
      .session(this._transactional.getSession(null))
      .lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async findManyUsers(ids: string[]): Promise<UserEntity[]> {
    const users = await this._userModel
      .find({ _id: { $in: ids } })
      .session(this._transactional.getSession(null))
      .lean();
    return users.map((user) => this._getUserEntity(user));
  }

  private _getUserFields(user: UserEntity): User {
    return {
      _id: user.id,
      email: user.email,
      username: user.username,
      avatarPath: user.avatarPath,
    };
  }

  private _getUserEntity(user: User): UserEntity {
    const userEntity = UserEntity.create({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatarPath: user.avatarPath,
    } satisfies IUser);

    return userEntity;
  }
}
