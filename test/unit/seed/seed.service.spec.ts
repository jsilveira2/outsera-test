import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { SeedService } from '../../../src/seed/seed.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import * as stream from 'stream';

// Mock de fs
vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    createReadStream: vi.fn(),
  };
});

// Mock de csv-parser
vi.mock('csv-parser', () => {
  return {
    default: () => new stream.Transform({
      objectMode: true,
      transform(chunk, _, callback) {
        callback(null, chunk); // passa o dado adiante
      }
    }),
  };
});

import * as fs from 'fs';

describe('SeedService', () => {
  let service: SeedService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      movie: {
        createMany: vi.fn(),
      },
    };

    const mockCsvStream = new stream.Readable({
      objectMode: true,
      read() {
        this.push({ year: '2021', title: 'Movie 1', studios: 'Studio A', producers: 'Producer A', winner: 'yes' });
        this.push({ year: '2022', title: 'Movie 2', studios: 'Studio B', producers: 'Producer B', winner: 'no' });
        this.push(null); // encerra o stream
      },
    });

    (fs.createReadStream as unknown as Mock).mockReturnValue(mockCsvStream as any);

    service = new SeedService(mockPrismaService as PrismaService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load and insert data from CSV', async () => {
    await service.onModuleInit();

    expect(fs.createReadStream).toHaveBeenCalled();
    expect(mockPrismaService.movie.createMany).toHaveBeenCalledWith({
      data: [
        { year: 2021, title: 'Movie 1', studios: 'Studio A', producers: 'Producer A', winner: true },
        { year: 2022, title: 'Movie 2', studios: 'Studio B', producers: 'Producer B', winner: false },
      ],
    });
  });
});
