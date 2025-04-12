import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import UsersCommandHandlers from '@/app/commands/user';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { UsersRepository } from '@/app/boundaries/repository';
import { PostgresUsersRepository } from '@/infrastructure/repository/pg';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot()],
  controllers: [UsersController],
  providers: [
    ...UsersCommandHandlers,
    {
      provide: UsersRepository,
      useClass: PostgresUsersRepository,
    },
    UsersService,
  ],
})
export class UsersModule {}
