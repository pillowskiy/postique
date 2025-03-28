import { QueryHandler } from '@nestjs/cqrs';
import { Query } from '../../common';
import { Inject } from '@nestjs/common';
import {
  PreferencesRepository,
  UserRepository,
} from '@/app/boundaries/repository';
import { Paginated } from '@/app/boundaries/dto/output/paginated.dto';
import { GetAuthorBlacklistQuery } from './get-author-blacklist.query';
import { UserMapper } from '@/app/boundaries/mapper';
import { ArrayUtils } from '@/utils/array';
import { User } from '@/app/boundaries/dto/output/user.dto';

@QueryHandler(GetAuthorBlacklistQuery)
export class GetAuthorBlacklistQueryHandler extends Query<
  GetAuthorBlacklistQuery,
  Paginated<User>
> {
  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(
    input: GetAuthorBlacklistQuery,
  ): Promise<Paginated<User>> {
    const pref = await this._preferencesRepository.preferences(input.userId);

    if (!pref) {
      return new Paginated<User>([], 0, 1);
    }

    const authorBlacklist = ArrayUtils.fromSetWithOffset(
      pref.authorBlacklist,
      input.skip,
      input.take,
    );
    const users = await this._userRepository.findManyUsers(authorBlacklist);

    const usersOutput = users.map((user) => UserMapper.toDto(user));
    const count = pref.authorBlacklist.size;
    const page = Math.floor(count / input.take) + 1;

    return new Paginated<User>(usersOutput, count, page);
  }
}
