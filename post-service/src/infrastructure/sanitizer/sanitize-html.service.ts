import {
  ALLOWED_ATTRIBUTES,
  ALLOWED_STYLES,
  ALLOWED_TAGS,
} from './sanitize-html.config';
import { Sanitizer } from './sanitizer.interface';
import sanitizeHTML from 'sanitize-html';

export class SanitizeHTMLService implements Sanitizer {
  sanitize(text: string): string {
    return sanitizeHTML(text, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
      allowedStyles: ALLOWED_STYLES,
      allowVulnerableTags: false,
      enforceHtmlBoundary: true,
    });
  }
}
