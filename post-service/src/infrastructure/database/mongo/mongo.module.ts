import { Transactional } from '@/app/boundaries/common';
import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { RequestScopeModule } from 'nj-request-scope';
import {
  AppConfigModule,
  AppConfigService,
} from '@/infrastructure/globals/config';
import { Schemas } from './shared/schema';
import { MongoTransactional } from './mongo.transactional';
import * as schemas from './schemas';

@Module({
  imports: [
    NestMongooseModule.forFeature([
      { name: Schemas.Posts, schema: schemas.PostSchema },
      { name: Schemas.Users, schema: schemas.UserSchema },
      { name: Schemas.Series, schema: schemas.PostSeriesSchema },
      { name: Schemas.Moderation, schema: schemas.ModerationSchema },
      { name: Schemas.Preferences, schema: schemas.PostPreferencesSchema },
      { name: Schemas.Paragraph, schema: schemas.ParagraphSchema },
      { name: Schemas.Content, schema: schemas.ContentSchema },
    ]),
    NestMongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.get('MONGO_URI'),
        replicaSet: configService.get('MONGO_REPLICA_SET'),
      }),
      inject: [AppConfigService],
    }),
    RequestScopeModule,
  ],
  providers: [
    {
      provide: Transactional,
      useClass: MongoTransactional,
    },
  ],
  exports: [NestMongooseModule, Transactional],
})
export class MongoModule {}
