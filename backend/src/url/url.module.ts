import { Module } from '@nestjs/common';
import { UrlService } from './url.service.js';
import { UrlController } from './url.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedirectController } from './redirect.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [UrlService],
  controllers: [UrlController, RedirectController]
})
export class UrlModule {}
