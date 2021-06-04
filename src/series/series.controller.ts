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
import { query } from 'express';
import { SeriesPagenation } from './dto/page.dto';
import { PostsOfSeriesResponse } from './dto/post-by-Id-response.dto';
@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  //시리즈 생성
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

  //게시글에 시리즈 붙이기
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

  //유저의 시리즈 전부 가져오기
  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.get['series'].operation)
  @ApiOkResponse(docs.get['series'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async getSeries(@Req() req): Promise<Series[]> {
    return this.seriesService.getSeries(req.user.id);
  }

  // 시리즈의 게시글 목록 가져오기
  @Get('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.get['series/posts'].operation)
  @ApiOkResponse(docs.get['series/posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  async getPostsOfSeries(
    @Req() req,
    // @Query('seriesId') seriesId: string,
    @Query() query: SeriesPagenation,
  ): Promise<PostsOfSeriesResponse> {
    return this.seriesService.getPostsOfSeries(
      req.user.id,
      query.seriesId,
      query.page,
      query.pageSize,
    );
  }

  //시리즈 내용 수정
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
  //시리즈 게시글 목록 순서 변경
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
