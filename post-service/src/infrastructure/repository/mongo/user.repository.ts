import { UserRepository } from '@/app/boundaries/repository';
import { UserEntity } from '@/domain/user';
import { InjectModel, Schemas, models } from '@/infrastructure/database/mongo';
import { User } from '@/infrastructure/database/mongo/schemas';

export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(Schemas.Users) private readonly _userModel: models.UserModel,
  ) {
    super();
  }

  async save(user: UserEntity): Promise<void> {
    await this._userModel.updateOne(
      { _id: user.id },
      { $set: this._getUserFields(user) },
      { upsert: true },
    );
  }

  async getUnique(username: string, email: string): Promise<UserEntity | null> {
    const user = await this._userModel.findOne({ username, email }).lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this._userModel.findOne({ username }).lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await this._userModel.findById(id).lean();
    if (!user) {
      return null;
    }

    return this._getUserEntity(user);
  }

  async findManyUsers(ids: string[]): Promise<UserEntity[]> {
    const users = await this._userModel.find({ _id: { $in: ids } }).lean();
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
      avatarPath: user.avatarPath,
    });

    return userEntity;
  }
}
