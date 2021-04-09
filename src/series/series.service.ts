import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesRepository } from './repository/series.repository';
// import { SeriesPostsRepository } from './repository/series_post.repository';

@Injectable()
export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository, // private readonly seriesPostRepository: SeriesPostsRepository,
  ) {}

  // 나의 시리즈 전체
  async getSeries(userId: string): Promise<Series[]> {
    return await this.seriesRepository.find({ user_id: userId });
  }
  // 나의 시리즈 중 하나의 게시글 목록
  async getSeriesOfPosts(userId: string, seriesId: string): Promise<Series[]> {
    return await this.seriesRepository.find({
      where: { id: seriesId },
      relations: ['posts'],
    });
  }

  async createSeries(userId: string, data: CreateSeriesDto): Promise<Series> {
    const newSeries = this.seriesRepository.createSeries(userId, data);
    return newSeries;
  }
  //
  async updateSeries(
    userId: string,
    seriesId: string,
    data: UpdateSeriesDto,
  ): Promise<Series> {
    return this.seriesRepository.updateSeries(userId, seriesId, data);
  }

  // async insertPostToSeries(postId, seriesId) {
  //   return this.seriesPostRepository.createSeriesPosts(postId, seriesId);
  // }

  async updateOrderOfSeries(
    userId: string,
    seriesId: string,
    data: UpdateOrderDto,
  ): Promise<Series> {
    return this.seriesRepository.updateOrderOfSeries(userId, seriesId, data);
  }
}
