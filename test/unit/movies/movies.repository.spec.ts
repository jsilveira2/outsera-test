import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoviesRepository } from '../../../src/movies/movies.repository';
import { Movie } from '../../../generated/prisma';

describe('MoviesRepository', () => {
  let repository: MoviesRepository;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      movie: {
        findMany: vi.fn(),
        createMany: vi.fn(),
      },
    };
    repository = new MoviesRepository(mockPrismaService);
  });

  describe('getAllWinners', () => {
    it('should return a list of winning movies', async () => {
      const mockMovies: Movie[] = [
        { id: 1, winner: true, title: 'Movie 1', year: 2020, producers: 'Producer A', studios: 'Studio A' },
        { id: 2, winner: true, title: 'Movie 2', year: 2021, producers: 'Producer B', studios: 'Studio B' },
      ];

      mockPrismaService.movie.findMany.mockResolvedValue(mockMovies);
      const result = await repository.getAllWinners();
      expect(result).toEqual(mockMovies);
      expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({ where: { winner: true } });
    });

    it('should return an empty list if no winning movies are found', async () => {
      mockPrismaService.movie.findMany.mockResolvedValue([]);
      const result = await repository.getAllWinners();
      expect(result).toEqual([]);
      expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({ where: { winner: true } });
    });
  });

  describe('createMany', () => {
    it('should create many movies', async () => {
      const moviesToCreate: Omit<Movie, 'id'>[] = [
        { winner: true, title: 'Movie 1', year: 2020, producers: 'Producer A', studios: 'Studio A' },
        { winner: true, title: 'Movie 2', year: 2021, producers: 'Producer B', studios: 'Studio B' },
      ];

      mockPrismaService.movie.createMany.mockResolvedValue(undefined);
      await repository.createMany(moviesToCreate);
      expect(mockPrismaService.movie.createMany).toHaveBeenCalledWith({ data: moviesToCreate });
    });

    it('should handle errors when creating movies', async () => {
      const moviesToCreate: Omit<Movie, 'id'>[] = [
        { winner: true, title: 'Movie 1', year: 2020, producers: 'Producer A', studios: 'Studio A' },
      ];

      mockPrismaService.movie.createMany.mockRejectedValue(new Error('Error creating movies'));
      await expect(repository.createMany(moviesToCreate)).rejects.toThrow('Error creating movies');
    });
  });
});
