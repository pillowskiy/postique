import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import UsersCommandHandlers from '@/app/commands/users';
import { UserRepository } from '@/app/boundaries/repository';
import { MongoUserRepository } from '@/infrastructure/repository/mongo';
import { MongoModule } from '@/infrastructure/database/mongo';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongoModule, CqrsModule.forRoot(), RabbitMQModule],
  controllers: [UsersController],
  providers: [
    ...UsersCommandHandlers,
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    UsersService,
  ],
})
export class UsersModule {}
