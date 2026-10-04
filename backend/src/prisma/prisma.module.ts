import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Module({
	controllers: [],
	providers: [{ provide: PrismaService, useFactory: (config: ConfigService) => {
		const adapter = new PrismaPg({
			connectionString: config.getOrThrow<string>('DATABASE_URL'),
		});
		return new PrismaService(adapter);
	}, inject: [ConfigService] }],
	exports: [PrismaService],
})
export class PrismaModule {}
