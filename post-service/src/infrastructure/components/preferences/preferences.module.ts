import { MongoModule } from '@/infrastructure/database/mongo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PreferencesController } from './preferences.controller';
import PreferencesCommandHandlers from '@/app/commands/preferences';
import { PreferencesRepository } from '@/app/boundaries/repository';
import { MongoPreferencesRepository } from '@/infrastructure/repository/mongo';
import { PreferencesService } from './preferences.service';
import { PreferencesAccessControlListModule } from '@/infrastructure/acl/preferences';

@Module({
  imports: [
    MongoModule,
    CqrsModule.forRoot(),
    PreferencesAccessControlListModule,
  ],
  controllers: [PreferencesController],
  providers: [
    ...PreferencesCommandHandlers,
    {
      provide: PreferencesRepository,
      useClass: MongoPreferencesRepository,
    },
    PreferencesService,
  ],
})
export class PreferencesModule {}
