import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MoviesModule } from '../movies/movies.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [MoviesModule, PrismaModule],
  providers: [SeedService],
})
export class SeedModule {}
