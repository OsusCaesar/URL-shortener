import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module.js';
import request from 'supertest'

describe('URL shortener (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
	const moduleFixture = await Test.createTestingModule({
	  imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe());
	await app.init();
  });

  afterAll(async () => {
	await app.close();
  });

  it('POST /urls creates an URL with a valid entry', async () => {
	const response = await request(app.getHttpServer())
	  .post('/urls')
	  .send({ originUrl: 'https://exemple.com' });

	expect(response.status).toBe(201);
	expect(response.body.shortUrl).toBeDefined();
  });

  it('POST /urls rejects URLs without protocol', async () => {
	const response = await request(app.getHttpServer())
	  .post('/urls')
	  .send({ originUrl: 'exemple.com' });

	expect(response.status).toBe(400);
  });

  it('GET /:code redirects to origin URL', async () => {
	const created = await request(app.getHttpServer())
	  .post('/urls')
	  .send({ originUrl: 'https://exemple.com' });

	const code = created.body.shortUrl.split('/').pop();

	const response = await request(app.getHttpServer()).get(`/${code}`);

	expect(response.status).toBe(302);
	expect(response.headers.location).toBe('https://exemple.com');
  });

  it('GET /:code with an unexisting code returns 404', async () => {
	const response = await request(app.getHttpServer()).get('/unexistingcode');

	expect(response.status).toBe(404);
  });
});
