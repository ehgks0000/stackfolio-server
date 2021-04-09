import { Post } from 'src/posts/entity/post.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Series } from '../entity/series.entity';
import { Series_posts } from '../entity/series_post.entity';

@EntityRepository(Series_posts)
export class SeriesPostsRepository extends Repository<Series_posts> {
  // eslint-disable-next-line
  async createSeriesPosts(postId: string, seriesId: string) {
    // const postRepository = getRepository(Post);
    // const SeriesRepository = getRepository(Series);
    // const { series_posts } = await SeriesRepository.findOne({ id: seriesId });
    // const { order: preOrder } = series_posts[-1];
    // const newSeriesPost = new Series_posts();
    // //이전 시리즈 포스트의 order + 1
    // // order 디폴트 값은 1
    // if (preOrder) {
    //   newSeriesPost.order = preOrder + 1;
    // }
    // newSeriesPost.post_id = postId;
    // newSeriesPost.series_id = seriesId;
    // await this.save(newSeriesPost);
  }
  // velog 처럼 드래그로 시리즈 순서를 변경 할 때
  // Series 테이블
  async updateOrderOfSeries(postId: string, seriesId: string) {
    const preSeries = await this.findOne({ id: seriesId, post_id: postId });
    return;
  }
}
