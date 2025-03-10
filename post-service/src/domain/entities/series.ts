export class PostSeries {
  constructor(
    public readonly id: string,
    private _title: string,
    private _description: string,
    private posts: string[] = [],
  ) {}

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  addPost(postId: string): void {
    if (this._hasPost(postId)) {
      throw new Error('Series already has this post');
    }
    this.posts.push(postId);
  }

  private _hasPost(postId: string): boolean {
    return this.posts.includes(postId);
  }
}
