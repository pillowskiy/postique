import { MongoModule } from '@/infrastructure/database/mongo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PreferencesController } from './preferences.controller';
import {
  PostRepository,
  PreferencesRepository,
  UserRepository,
} from '@/app/boundaries/repository';
import {
  MongoPostRepository,
  MongoPreferencesRepository,
  MongoUserRepository,
} from '@/infrastructure/repository/mongo';
import { PreferencesAccessControlListModule } from '@/infrastructure/acl/preferences';
import PreferencesCommandHandlers from '@/app/commands/preferences';
import PreferencesQueryHandler from '@/app/queries/preferences';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [
    MongoModule,
    CqrsModule.forRoot(),
    PreferencesAccessControlListModule,
  ],
  controllers: [PreferencesController],
  providers: [
    ...PreferencesCommandHandlers,
    ...PreferencesQueryHandler,
    {
      provide: PreferencesRepository,
      useClass: MongoPreferencesRepository,
    },
    {
      provide: PostRepository,
      useClass: MongoPostRepository,
    },
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    PreferencesService,
  ],
})
export class PreferencesModule {}
