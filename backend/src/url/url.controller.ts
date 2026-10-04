import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlService } from './url.service.js';
import { CreateUrlDto } from './dto/create-url.dto.js';
import { URLs } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';

@Controller('urls')
export class UrlController {
	private readonly domain: string;

	constructor(private urlService: UrlService, config: ConfigService) {
		this.domain = config.getOrThrow<string>('DOMAIN');
	}
	
	private addPrefix(url: URLs): URLs {
		url.shortUrl = this.domain.concat(url.shortUrl);
		return url;
	}

	@Post()
	async createUrl(@Body() createUrlDto: CreateUrlDto) {
		const url: URLs = await this.urlService.createUrl(createUrlDto);
		return this.addPrefix(url);
	}

	@Get()
	async listUrls(): Promise<URLs[]> {
		const urlList: URLs[] = await this.urlService.listUrls();
		return urlList.map((url) => this.addPrefix(url));
	}
}
