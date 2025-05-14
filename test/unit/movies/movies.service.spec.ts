import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoviesService } from '../../../src/movies/movies.service';
import { AwardRangeDto } from '../../../src/movies/dto/movie.dto';
import { awardRangeSchema } from '../../../src/movies/dto/movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      getAllWinners: vi.fn(),
    };
    service = new MoviesService(mockRepository);
  });

  it('should return award intervals with min and max', async () => {
    const mockMovies = [
      { producers: 'Producer A, Producer B', year: 2020 },
      { producers: 'Producer A', year: 2023 },
      { producers: 'Producer B', year: 2025 },
    ];

    mockRepository.getAllWinners.mockResolvedValue(mockMovies);

    const result: AwardRangeDto = await service.getAwardIntervals();
    expect(result).toHaveProperty('min');
    expect(result).toHaveProperty('max');

    const parsed = awardRangeSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });

  it('should return an empty array when no winners are available', async () => {
    mockRepository.getAllWinners.mockResolvedValue([]);

    const result: AwardRangeDto = await service.getAwardIntervals();
    expect(result.min).toEqual([]);
    expect(result.max).toEqual([]);
    const parsed = awardRangeSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});
