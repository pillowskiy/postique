export class SaveUserOutput {
  constructor(public readonly userId: string) {}
}

export class UserOutput {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly avatarPath: string,
  ) {}
}
