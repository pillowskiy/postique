import { EntityFactory, IncomingEntity } from '../common/entity';
import { PostSchema } from './post.schema';

export class PostEntity {
  static create(
    input: IncomingEntity<PostEntity, { status?: string; visibility?: string }>,
  ): PostEntity {
    const validPost = EntityFactory.create(PostSchema, input);
    return new PostEntity(
      validPost.id,
      validPost.title,
      validPost.description!,
      validPost.coverImage,
      validPost.visibility,
      validPost.status,
    );
  }

  protected constructor(
    public readonly id: string,
    private _title: string,
    private _description: string,
    private _coverImage: string | null = null,
    private _visibility: string,
    private _status: string,
  ) {}

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get coverImage(): string | null {
    return this._coverImage;
  }

  get visibility(): string {
    return this._visibility;
  }

  get status(): string {
    return this._status;
  }

  edit(input: Partial<Omit<PostEntity, 'id'>>) {
    const validPost = EntityFactory.create(PostSchema, {
      id: this.id,
      title: input.title ?? this.title,
      description: input.description ?? this.description,
      coverImage: input.coverImage ?? this.coverImage,
      visibility: input.visibility ?? this.visibility,
      status: input.status ?? this.status,
    });

    this._title = validPost.title;
    this._description = validPost.description!;
    this._coverImage = validPost.coverImage ?? null;
    this._visibility = validPost.visibility;
    this._status = validPost.status;
  }

  updateContent({
    title,
    description,
  }: Partial<Pick<PostEntity, 'title' | 'description'>>) {
    this._title = title ?? this.title;
    this._description = description ?? this.description;
  }

  updateVisibility(visibility: string) {
    this._visibility = visibility;
  }

  updateStatus(status: string) {
    this._status = status;
  }

  updateCoverImage(coverImage: string | null) {
    this._coverImage = coverImage;
  }
}
