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

  private _getUserEntity(user: User): UserEntity {
    const userEntity = UserEntity.create({
      id: user._id.toString(),
      username: user.username,
      avatarPath: user.avatarPath,
    });

    return userEntity;
  }
}
