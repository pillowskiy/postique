import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { EntityFactory } from '../../common/entity';
import type { IncomingPostSeries, IPostSeries } from './series.interface';
import { PostSeriesSchema } from './series.schema';

export class PostSeriesEntity implements IPostSeries {
  static create(series: IncomingPostSeries): PostSeriesEntity {
    const validSeries = EntityFactory.create(PostSeriesSchema, series);
    return new PostSeriesEntity(validSeries);
  }

  public readonly id: string;
  private _title: string;
  private _slug: string;
  private _description: string = '';
  private _posts: string[] = [];

  private constructor(series: IPostSeries) {
    this.id = series.id;
    this._title = series.title;
    this._slug = series.slug;
    this._description = series.description;
    this._posts = [...series.posts];
  }

  get title(): string {
    return this._title;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get posts(): Readonly<string[]> {
    return this._posts;
  }

  addPost(postId: string): void {
    if (this._hasPost(postId)) {
      throw new DomainBusinessRuleViolation('Series already has this post');
    }
    this._posts.push(postId);
  }

  removePost(postId: string): void {
    if (!this._hasPost(postId)) {
      throw new DomainBusinessRuleViolation('Series does not have this post');
    }
    this._posts.splice(this._posts.indexOf(postId), 1);
  }

  updateTitle(title: string, slug: string): void {
    this._title = title;
    this._slug = slug;
  }

  updateDescription(description: string): void {
    this._description = description;
  }

  private _hasPost(postId: string): boolean {
    return this.posts.includes(postId);
  }
}
