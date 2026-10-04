import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { Prisma, URLs } from '../generated/prisma/client.js';
import { randomBytes } from 'crypto';
import { CODE_LEN, MAX_CODEGEN_ATTEMPTS } from './url.constants.js';

@Injectable()
export class UrlService {
	constructor(private prisma: PrismaService) {}
	
	async createUrl(createUrlDto: CreateUrlDto): Promise<URLs> {
		for (let attempt: number = 0; attempt < MAX_CODEGEN_ATTEMPTS; attempt++) {
			// génère une short url
			const code = randomBytes(2*CODE_LEN).toString('base64url').slice(0, CODE_LEN);
			// insère l'url dans la DB (si erreur d'unicité du code refait)
			try {
				return await this.prisma.uRLs.create({ data: {shortUrl: code, originUrl: createUrlDto.originUrl} });
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError 
					&& e.code === "P2002" 
					&& Array.isArray(e.meta?.target) && e.meta?.target.includes("shortUrl")){
					continue ;
				}
				throw e;
			}
		}
		throw new InternalServerErrorException("Reached limit of attempts to generate a unique code");
	}

	async getUrl(shortUrl: string): Promise<string> {
		// cherche si l'url est dans la DB
		const url: URLs | null = await this.prisma.uRLs.findUnique({ where: { shortUrl: shortUrl, } });
		// si elle n'y est pas renvoie une erreur
		if (url === null)
			throw new NotFoundException("This short URL is not present in the database");
		// si elle y est renvoie sa longUrl associée
		return url.originUrl;
	}

	async listUrls(): Promise<URLs[]> {
		// renvoie la liste d'URLs de la DB
		return await this.prisma.uRLs.findMany();
	}
}
