import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MoviesService } from '../../src/movies/movies.service';
import { MoviesRepository } from '../../src/movies/movies.repository';
import { SeedService } from '../../src/seed/seed.service';
import { AwardRangeDto } from '../../src/movies/dto/movie.dto';

describe('MoviesService Integration Test', () => {
  let prismaService: PrismaService;
  let service: MoviesService;
  let repo: MoviesRepository;
  let seedService: SeedService;

  beforeEach(async () => {
    prismaService = new PrismaService();
    await prismaService.movie.deleteMany({});
    seedService = new SeedService(prismaService);
    await seedService.loadCSVAndInsert('Movielist.csv');

    repo = new MoviesRepository(prismaService);
    service = new MoviesService(repo);
  });

  afterEach(async () => {
    await prismaService.movie.deleteMany({});
  });

  it('should return award intervals matching the CSV file', async () => {
    const result = await service.getAwardIntervals();

    const expectedResult: AwardRangeDto = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    expect(result).toEqual(expectedResult);
  });
});
