import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { Prisma } from './generated/prisma/client.js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
