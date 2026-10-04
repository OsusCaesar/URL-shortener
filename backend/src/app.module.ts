import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module.js';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }), PrismaModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
