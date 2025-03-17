import { ISanitizer } from '@/domain/common/sanititizer';

export abstract class Sanitizer implements ISanitizer {
  abstract sanitize(text: string): string;
}
