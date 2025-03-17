import { Module } from '@nestjs/common';
import { Sanitizer } from './sanitizer.interface';
import { SanitizeHTMLService } from './sanitize-html.service';

@Module({
  providers: [
    {
      provide: Sanitizer,
      useClass: SanitizeHTMLService,
    },
  ],
  exports: [Sanitizer],
})
export class SanitizerModule {}
