import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Series } from './entity/series.entity';
import { SeriesRepository } from './repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

  async createSeries(userId: string, data: CreateSeriesDto): Promise<Series> {
    return this.seriesRepository.createSeries(userId, data);
  }
  async insertPost(seriesId: string, userId: string, postId: string) {
    return this.seriesRepository.insertPost(seriesId, userId, postId);
  }
  //내 아이디의 전체 시리즈 목록
  async getSeries(userId: string): Promise<Series[]> {
    return this.seriesRepository.find({
      where: { user_id: userId },
      relations: ['posts'],
    });
  }
  // 내 아이디의 한 시리즈의 게시글 목록
  async getPostsOfSeries(userId: string, seriesId: string) {
    return this.seriesRepository.find({ id: seriesId, user_id: userId });
  }
  async updateSeries() {
    return;
  }
  async updateOrderOfSeries(seriesId: string, data: UpdateOrderDto) {
    return this.seriesRepository.updateOrder(seriesId, data);
  }
}
