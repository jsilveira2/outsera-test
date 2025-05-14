import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoviesController } from '../../../src/movies/movies.controller';
import { AwardRangeDto } from '../../../src/movies/dto/movie.dto';
import { awardRangeSchema } from 'src/movies/dto/movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      getAwardIntervals: vi.fn(),
    };
    controller = new MoviesController(mockService);
  });

  it('should return the correct award intervals', async () => {
    const mockAwardIntervals: AwardRangeDto = {
      min: [
        {
          producer: 'Producer A',
          interval: 3,
          previousWin: 2020,
          followingWin: 2023,
        },
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 5,
          previousWin: 2015,
          followingWin: 2020,
        },
      ],
    };

    mockService.getAwardIntervals.mockResolvedValue(mockAwardIntervals);

    const result = await controller.getAwardIntervals();
    expect(result).toEqual(mockAwardIntervals);
    const parsed = awardRangeSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });
});
