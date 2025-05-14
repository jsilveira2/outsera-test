import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MoviesService } from '../../src/movies/movies.service';
import { MoviesRepository } from '../../src/movies/movies.repository';

describe('MoviesService Integration Test', () => {
  let prismaService: PrismaService;
  let service: MoviesService;
  let repo: MoviesRepository;

  beforeEach(async () => {
    // Configuração do banco de dados real (ou em memória)
    prismaService = new PrismaService();
    repo = new MoviesRepository(prismaService);
    service = new MoviesService(repo);

    // Limpar o banco de dados antes de cada teste, se necessário
    await prismaService.movie.deleteMany({});
  });

  afterEach(async () => {
    // Limpar os dados após cada teste
    await prismaService.movie.deleteMany({});
  });

  it('should return correct award intervals from the database', async () => {
    // Insira dados reais no banco de dados de teste
    await prismaService.movie.createMany({
      data: [
        { year: 2020, title: 'Movie 1', studios: 'Studio A', producers: 'Producer A, Producer B', winner: true },
        { year: 2023, title: 'Movie 2', studios: 'Studio B', producers: 'Producer A', winner: true },
        { year: 2025, title: 'Movie 3', studios: 'Studio C', producers: 'Producer B', winner: true },
      ],
    });

    // Teste real do método que vai consultar o banco
    const result = await service.getAwardIntervals();

    // Verifique os resultados baseados no banco de dados real
    expect(result).toHaveProperty('min');
    expect(result).toHaveProperty('max');
  });
});
