export class SaveUserInput {
  id: string;
  email: string;
  username: string;
  avatarPath: string;

  constructor(id: string, email: string, username: string, avatarPath: string) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.avatarPath = avatarPath;
  }
}
