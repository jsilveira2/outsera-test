import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllWinners(): Promise<Movie[]> {
    return this.prisma.movie.findMany({ where: { winner: true } });
  }

  async createMany(movies: Omit<Movie, 'id'>[]): Promise<void> {
    await this.prisma.movie.createMany({ data: movies });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.movie.deleteMany();
  }
}
