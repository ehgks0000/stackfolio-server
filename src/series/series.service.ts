import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesRepository } from './repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

  async getSeries(): Promise<Series[]> {
    return this.seriesRepository.find();
  }

  async createSeries(userId: string, data: CreateSeriesDto): Promise<Series> {
    const newSeries = this.seriesRepository.createSeries(userId, data);
    return newSeries;
  }
  //
  async updateSeries(userId: string, seriesId: string, data: UpdateSeriesDto) {
    return this.seriesRepository.updateSeries(userId, seriesId, data);
  }
}
