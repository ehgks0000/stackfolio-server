import { User } from 'src/users/entity/user.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Series } from '../entity/series.entity';

@EntityRepository(Series)
export class SeriesRepository extends Repository<Series> {
  // eslint-disable-next-line
  async createSeries(userId: string, data: CreateSeriesDto) {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ id: userId });
    const { name, description, thumbnail, slug } = data;

    const newSeries = new Series();
    // newSeries = {
    //   data,
    // };
    newSeries.name = name;
    newSeries.description = description;
    newSeries.thumbnail = thumbnail;
    newSeries.slug = slug;

    newSeries.user_id = userId;

    // user.series = [...user.series, newSeries];

    // await userRepository.save(user);
    await this.save(newSeries);

    return newSeries;
  }

  async updateSeries(
    userId: string,
    seriesId: string,
    data: UpdateSeriesDto,
  ): Promise<Series> {
    // 시리즈 이름만 넣자

    const { name, description, thumbnail, slug } = data;
    const updatedSeries = await this.findOne({ id: seriesId, user_id: userId });
    // updatedSeries = {
    //   ...updatedSeries,
    //   data,
    // };
    updatedSeries.name = name;
    updatedSeries.description = description;
    updatedSeries.thumbnail = thumbnail;
    updatedSeries.slug = slug;

    await this.save(updatedSeries);
    return updatedSeries;
  }

  async updateOrderOfSeries(
    userId: string,
    seriesId: string,
    data: UpdateOrderDto,
  ): Promise<Series> {
    const series = await this.findOne({ id: seriesId, user_id: userId });

    series.post_id = data.postIds;

    await this.save(series);
    return series;
  }
}
