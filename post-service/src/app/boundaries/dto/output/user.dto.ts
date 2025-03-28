export class SaveUserOutput {
  constructor(public readonly userId: string) {}
}

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly avatarPath: string,
  ) {}
}
