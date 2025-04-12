import { IdentifierDto } from '../common';

export class UserOutput {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly avatarPath: string,
  ) {}
}

export class SaveUserOutput extends IdentifierDto {}
