import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { NotFoundException } from '@nestjs/common';

describe('UrlService', () => {
  let service: UrlService;
  let prisma: { uRLs: { create: ReturnType<typeof vi.fn>, findUnique: ReturnType<typeof vi.fn>, findMany: ReturnType<typeof vi.fn> } };

  beforeEach(async () => {
    prisma = {
      uRLs: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('successful URL creation', async () => {
    prisma.uRLs.create.mockResolvedValue({ id: 1, shortUrl: 'abc123', originUrl: 'https://exemple.com', date: new Date() });

    const result = await service.createUrl({ originUrl: 'https://exemple.com' });

    expect(result.originUrl).toBe('https://exemple.com');
    expect(prisma.uRLs.create).toHaveBeenCalledTimes(1);
  });

  it('short URL database collision', async () => {
    const uniqueConstraintError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: 'x', meta: { target: ['shortUrl'] } },
    );

    prisma.uRLs.create
      .mockRejectedValueOnce(uniqueConstraintError)
      .mockResolvedValueOnce({ id: 1, shortUrl: 'xyz789', originUrl: 'https://exemple.com' });

    const result = await service.createUrl({ originUrl: 'https://exemple.com' });

    expect(result.shortUrl).toBe('xyz789');
    expect(prisma.uRLs.create).toHaveBeenCalledTimes(2);
  });

  it('NotFoundException if the code does not exist', async () => {
    prisma.uRLs.findUnique.mockResolvedValue(null);

    await expect(service.getUrl('inexistant')).rejects.toThrow(NotFoundException);
  });

  it('redirects to origin URL', async () => {
    prisma.uRLs.findUnique.mockResolvedValue({ id: 1, shortUrl: 'abc123', originUrl: 'https://exemple.com' });

    const result = await service.getUrl('abc123');

    expect(result).toBe('https://exemple.com');
  });

});
