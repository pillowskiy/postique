import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { Schemas } from './common/schema';
import * as schemas from './schemas';

@Module({
  imports: [
    NestMongooseModule.forFeature([
      { name: Schemas.Posts, schema: schemas.PostSchema },
      { name: Schemas.Users, schema: schemas.UserSchema },
      { name: Schemas.Series, schema: schemas.PostSeriesSchema },
      { name: Schemas.Moderation, schema: schemas.ModerationSchema },
      { name: Schemas.Preferences, schema: schemas.PostPreferencesSchema },
    ]),
    NestMongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class MongoModule {}
