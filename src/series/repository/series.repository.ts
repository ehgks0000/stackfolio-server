import { BadRequestException } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Series } from '../entity/series.entity';
@EntityRepository(Series)
export class SeriesRepository extends Repository<Series> {
  // eslint-disable-next-line
  async createSeries(userId: string, data: CreateSeriesDto) {
    const newSeries = new Series();
    const { name, description, thumbnail, slug } = data;

    const mySeries = await this.find({ user_id: userId });
    mySeries.forEach((series) => {
      if (series.name === name) {
        throw new BadRequestException('내 시리즈 중 이미 있는 이름입니다.');
      }
    });

    newSeries.name = name;
    newSeries.description = description;
    newSeries.thumbnail = thumbnail;
    newSeries.slug = slug;

    newSeries.user_id = userId;

    await this.save(newSeries);

    return newSeries;
  }

  async insertPost(
    seriesId: string,
    userId: string,
    postId: string,
  ): Promise<void> {
    const postRepository = getRepository(Post);

    const series = await this.findOne({
      where: { id: seriesId, user_id: userId },
      relations: ['posts'],
    });

    const post = await postRepository.findOne({ id: postId });
    console.log(series);
    series.posts = [...series.posts, post];
    console.log(series);

    // console.log(post);
    // post.series_id = seriesId;
    // console.log(post);

    // await postRepository.save(post);

    await this.save(series);
    // return mySeries;
  }

  async updateOrder(seriesId: string, data: UpdateOrderDto) {
    const postRepository = getRepository(Post);
    const series = await this.findOne({ id: seriesId });

    series.posts = [];

    const posts = await postRepository.findByIds(data.post_ids);

    // 왜 postId의 순서가 바뀌지 않을까?
    series.posts = posts;
    await this.save(series);
    // return series;
  }
}
