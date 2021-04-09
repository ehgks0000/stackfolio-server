import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesRepository } from './repository/series.repository';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesRepository])],
  providers: [SeriesService],
  exports: [SeriesService],
  controllers: [SeriesController],
})
export class SeriesModule {}
