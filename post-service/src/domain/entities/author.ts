export class PostAuthor {
  public readonly id: string;
  public readonly profile: AuthorProfile;

  private constructor(id: string, name: string, bio?: string) {
    this.id = id;
    this.profile = AuthorProfile.create(name, bio);
  }
}

export class AuthorProfile {
  static create(username: string, bio?: string): AuthorProfile {
    return new AuthorProfile(username, bio);
  }

  private constructor(
    public readonly username: string,
    public readonly bio?: string,
  ) {}
}
