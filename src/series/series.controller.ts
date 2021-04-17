import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesService } from './series.service';
import docs from './series.docs';
import { Post as _Post } from 'src/posts/entity/post.entity';
@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['series'].operation)
  @ApiOkResponse(docs.post['series'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async createSeries(
    @Req() req,
    @Body() data: CreateSeriesDto,
  ): Promise<Series> {
    return this.seriesService.createSeries(req.user.id, data);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['series/posts'].operation)
  @ApiOkResponse(docs.post['series/posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async inserPost(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Query('postId') postId: string,
  ): Promise<void> {
    return this.seriesService.insertPost(seriesId, req.user.id, postId);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.get['series'].operation)
  @ApiOkResponse(docs.get['series'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async getSeries(@Req() req): Promise<Series[]> {
    return this.seriesService.getSeries(req.user.id);
  }

  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.get['series/posts'].operation)
  @ApiOkResponse(docs.get['series/posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async getPostsOfSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
  ): Promise<_Post[]> {
    return this.seriesService.getPostsOfSeries(req.user.id, seriesId);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.patch['series'].operation)
  @ApiOkResponse(docs.patch['series'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async updateSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateSeriesDto,
  ): Promise<void> {
    return this.seriesService.updateSeries(req.user.id, seriesId, data);
  }

  /**
   * @todo
   * 시리즈 순서 변경 어떻게 해야할까?
   *
   *  **/
  @Patch('order')
  //   @UseGuards(JwtAuthGuard)
  //   @ApiBearerAuth()
  //   @ApiOperation(docs.patch['series/order'].operation)
  //   @ApiOkResponse(docs.patch['series/order'].response[200])
  //   @ApiUnauthorizedResponse(docs.unauthorized)
  async updateOrderOfSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateOrderDto,
  ) {
    return this.seriesService.updateOrderOfSeries(seriesId, data);
  }
}
