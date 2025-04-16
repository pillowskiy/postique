import { nanoid } from 'nanoid';
import libSlugify from 'slugify';

export function slugify(text: string): string {
  const nativeSlug = libSlugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  return `${nativeSlug}-${nanoid(8)}`;
}
