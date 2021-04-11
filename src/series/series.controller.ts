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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesService } from './series.service';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSeries(
    @Req() req,
    @Body() data: CreateSeriesDto,
  ): Promise<Series> {
    return this.seriesService.createSeries(req.user.id, data);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  async inserPost(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Query('postId') postId: string,
  ): Promise<void> {
    return this.seriesService.insertPost(seriesId, req.user.id, postId);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getSeries(@Req() req): Promise<Series[]> {
    return this.seriesService.getSeries(req.user.id);
  }

  @Get('posts')
  @UseGuards(JwtAuthGuard)
  async getPostsOfSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
  ): Promise<Series[]> {
    return this.seriesService.getPostsOfSeries(req.user.id, seriesId);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async updateSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateSeriesDto,
  ): Promise<void> {
    return this.seriesService.updateSeries(req.user.id, seriesId, data);
  }

  @Patch('order')
  async updateOrderOfSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateOrderDto,
  ) {
    return this.seriesService.updateOrderOfSeries(seriesId, data);
  }
}
