import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { Movie } from '@prisma/client';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    console.log('Iniciando SeedService');
    const defaultPath = 'Movielist.csv';
    const filePath = path.resolve(defaultPath);

    console.log(`Fazendo a leitura CSV de: ${filePath}`);
    await this.loadCSVAndInsert(filePath);
  }

async loadCSVAndInsert(filePath: string): Promise<void> {
  const movies: Omit<Movie, 'id'>[] = [];

  const prisma = this.prisma;
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row) => {
        const movie = {
          year: parseInt(row.year),
          title: row.title,
          studios: row.studios,
          producers: row.producers,
          winner: row.winner?.toLowerCase() === 'yes',
        };

        movies.push(movie);
      })
      .on('end', async () => {
        for (const movie of movies) {
          const existingMovie = await prisma.movie.findFirst({
            where: { title: movie.title, year: movie.year },
          });

          if (!existingMovie) {
            await prisma.movie.create({
              data: movie,
            });
          }
        }

        console.log(`Inseridos ${movies.length} filmes no database.`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Erro durante leitura do CSV:', err);
        reject(err);
      });
  });
}

}
