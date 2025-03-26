import { SaveUserInput } from '@/app/boundaries/dto/input';

export class SaveUserCommand extends SaveUserInput {
  constructor(input: SaveUserInput) {
    super(input.id, input.email, input.username, input.avatarPath);
  }
}
