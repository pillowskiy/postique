export class SaveUserInput {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly avatarPath: string,
  ) {}
}
