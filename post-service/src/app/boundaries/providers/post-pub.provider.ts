export interface IPostPayload {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  visibility: string;
  status: string;
}

export interface IPostWithContentPayload extends IPostPayload {
  content: string;
}

export abstract class PostPublisher {
  abstract publishCreated(post: IPostPayload): Promise<void>;
  abstract publishModified(post: IPostPayload): Promise<void>;
  abstract publishPublished(post: IPostWithContentPayload): Promise<void>;
}
