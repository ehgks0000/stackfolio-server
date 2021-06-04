import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { PostsOfSeriesResponse } from './dto/post-by-Id-response.dto';
import { SeriesNameResponse } from './dto/seriesNameResponse.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesRepository } from './repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

  //시리즈 생성
  async createSeries(userId: string, data: CreateSeriesDto): Promise<Series> {
    return this.seriesRepository.createSeries(userId, data);
  }

  // 게시글을 시리즈에 등록
  async insertPost(
    seriesId: string,
    userId: string,
    postId: string,
  ): Promise<void> {
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
  async getPostsOfSeries(
    userId: string,
    seriesId: string,
    page: number,
    pageSize: number,
  ): Promise<PostsOfSeriesResponse> {
    //   async getPostsOfSeries(userId: string, seriesId: string): Promise<Post[]> {
    const series = await this.seriesRepository
      .createQueryBuilder('series')
      .leftJoinAndSelect('series.posts', 'posts')
      .where('series.id = :seriesId', { seriesId: seriesId })
      .andWhere('series.user_id = :user_id', { user_id: userId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    // console.log('테스트 :', test);

    // const series = await this.seriesRepository.findOne({
    //   where: { id: seriesId, user_id: userId },
    //   relations: ['posts'],
    // });
    return { page, pageSize, series };
  }
  async updateSeries(
    userId: string,
    seriesId: string,
    data: UpdateSeriesDto,
  ): Promise<void> {
    let updatedSeries = await this.seriesRepository.findOne({
      id: seriesId,
      user_id: userId,
    });

    const { description, name, slug, thumbnail } = data;
    updatedSeries = {
      ...updatedSeries,
      description,
      name,
      slug,
      thumbnail,
    };

    await this.seriesRepository.save(updatedSeries);
  }
  async updateOrderOfSeries(seriesId: string, data: UpdateOrderDto) {
    return this.seriesRepository.updateOrder(seriesId, data);
  }

  async getSeriesByID(seriesId: string): Promise<SeriesNameResponse> {
    const { name: seriesName } = await this.seriesRepository.findOne({
      id: seriesId,
    });

    return { seriesName };
  }
}
