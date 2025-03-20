import { IParagraph } from './paragraph/content-paragraph.interface';

export type IncomingPostContent = Omit<IPostContent, {}>;

export interface IPostContent {
  title: string;
  description: string;
  paragraphs: IParagraph<any>[];
  createdAt: Date;
}
