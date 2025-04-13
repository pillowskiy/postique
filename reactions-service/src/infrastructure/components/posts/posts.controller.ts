import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PostsEventPattern } from '@/infrastructure/rabbitmq';
import { PostsEvents } from './posts.events';
import { PostsService } from './posts.service';
import { PostInput } from '@/app/boundaries/dto/input';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @EventPattern(PostsEvents.Created)
  async handleUserRegistered(
    @Payload() payload: PostInput,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._postsService.createPost(payload);
    channel.ack(originalMsg);
  }

  @PostsEventPattern(PostsEvents.Modified)
  async handleUserProfileChanges(
    @Payload() payload: PostInput,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this._postsService.editPost(payload);
    channel.ack(originalMsg);
  }
}
