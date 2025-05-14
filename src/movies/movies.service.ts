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
      const producers = movie.producers.split(/,| and /).map(p => p.trim());
      for (const producer of producers) {
        if (!producerMap.has(producer)) {
          producerMap.set(producer, []);
        }
        (producerMap.get(producer) as number[]).push(movie.year);
      }
    }

    const intervals: AwardRangeDto['min'] = [];

    for (const [producer, years] of producerMap.entries()) {
      if (years.length < 2) continue;
      const sorted = years.sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        intervals.push({
          producer,
          interval: sorted[i] - sorted[i - 1],
          previousWin: sorted[i - 1],
          followingWin: sorted[i],
        });
      }
    }

    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));

    const result = {
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval),
    };

    return awardRangeSchema.parse(result);
  }

  async deleteAwardIntervals(): Promise<void> {
    return this.repo.deleteAll();
  }
}
