import { Injectable } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import { AwardRangeDto, awardRangeSchema } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly repo: MoviesRepository) {}

  async getAwardIntervals(): Promise<AwardRangeDto> {
    const winners = await this.repo.getAllWinners();

    const producerMap = new Map<string, number[]>();

    for (const movie of winners) {
      const producers = movie.producers.split(/,| and /).map((p) => p.trim());
      for (const producer of producers) {
        if (!producerMap.has(producer)) {
          producerMap.set(producer, []);
        }
        producerMap.get(producer)?.push(movie.year);
      }
    }

    const intervals: AwardRangeDto['min'] = [];

    for (const [producer, years] of producerMap.entries()) {
      if (years.length < 2) continue;
      const sortedYears = years.sort((a, b) => a - b);

      for (let i = 1; i < sortedYears.length; i++) {
        intervals.push({
          producer,
          interval: sortedYears[i] - sortedYears[i - 1],
          previousWin: sortedYears[i - 1],
          followingWin: sortedYears[i],
        });
      }
    }

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    const result = {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };

    return awardRangeSchema.parse(result);
  }

  async deleteAwardIntervals(): Promise<void> {
    return this.repo.deleteAll();
  }
}
