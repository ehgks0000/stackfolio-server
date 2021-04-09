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

  @Get()
  @UseGuards(JwtAuthGuard)
  getSeries(@Req() req): Promise<Series[]> {
    return this.seriesService.getSeries(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getSeriesOfPosts(
    @Req() req,
    @Query('seriesId') seriesId: string,
  ): Promise<Series[]> {
    return this.seriesService.getSeriesOfPosts(req.user.id, seriesId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createSeries(@Req() req, @Body() data: CreateSeriesDto): Promise<Series> {
    return this.seriesService.createSeries(req.user.id, data);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateSeries(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateSeriesDto,
  ): Promise<Series> {
    return this.seriesService.updateSeries(req.user.id, seriesId, data);
  }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // insertPostToSeries(
  //   @Req() req,
  //   @Query('postId') postId: string,
  //   @Query('seriesId') seriesId: string,
  // ) {
  //   return this.seriesService.insertPostToSeries(postId, seriesId);
  // }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateOrderSeriesPost(
    @Req() req,
    @Query('seriesId') seriesId: string,
    @Body() data: UpdateOrderDto,
  ): Promise<Series> {
    return this.seriesService.updateOrderOfSeries(req.user.id, seriesId, data);
  }
}
