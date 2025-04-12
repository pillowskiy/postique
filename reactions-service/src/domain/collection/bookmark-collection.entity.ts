import { EntityFactory, IncomingEntity } from '../common/entity';
import { BookmarkCollectionSchema } from './bookmark-collection.schema';

export class BookmarkCollectionEntity {
  static create(
    input: IncomingEntity<BookmarkCollectionEntity>,
  ): BookmarkCollectionEntity {
    const validCollection = EntityFactory.create(
      BookmarkCollectionSchema,
      input,
    );

    return new BookmarkCollectionEntity(
      validCollection.id!,
      validCollection.userId,
      validCollection.name,
      validCollection.description!,
      validCollection.createdAt!,
      validCollection.updatedAt!,
    );
  }

  protected constructor(
    public readonly id: string,
    public readonly userId: string,
    private _name: string,
    private _description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  updateName(name: string): void {
    this._name = name;
  }

  updateDescription(description: string): void {
    this._description = description;
  }
}
