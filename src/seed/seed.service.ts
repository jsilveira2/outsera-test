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
    const envPath = process.env.CSV_PATH;
    const defaultPath = 'movies.csv';
    const filePath = path.resolve(process.cwd(), envPath || defaultPath);

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
          movies.push({
            year: parseInt(row.year),
            title: row.title,
            studios: row.studios,
            producers: row.producers,
            winner: row.winner?.toLowerCase() === 'yes',
          });
        })
        .on('end', async () => {
          await prisma.movie.createMany({ data: movies });
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
