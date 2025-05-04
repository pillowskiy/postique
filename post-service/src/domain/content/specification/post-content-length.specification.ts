import { ParagraphAggregate } from '../entity';

export class PostContentLengthSpecification {
  /**
   * The minimum required total character length across all paragraphs.
   */
  static readonly MIN_LENGTH = 256;

  // TODO: Move this logic into the ParagraphAggregate domain entity, or a PostContent value object.
  isSatisfiedBy(content: ParagraphAggregate[]): boolean {
    // TODO: Replace raw character count logic with semantic analysis, if applicable.
    const rawLength = content.reduce((acc, cur) => acc + cur.text.length, 0);
    return rawLength > PostContentLengthSpecification.MIN_LENGTH;
  }
}
