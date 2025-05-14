import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AwardRangeDto } from './dto/movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Get('awards/intervals')
  async getAwardIntervals(): Promise<AwardRangeDto> {
    return this.service.getAwardIntervals();
  }
}
