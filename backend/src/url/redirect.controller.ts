import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from './url.service.js';

@Controller()
export class RedirectController {
	constructor(private urlService: UrlService) {}

	@Get(':shortUrl')
	@Redirect()
	async redirectToOrigin(@Param('shortUrl') shortUrl: string) {
		return { url: await this.urlService.getUrl(shortUrl) };
	}
}
