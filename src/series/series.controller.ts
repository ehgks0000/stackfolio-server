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
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entity/series.entity';
import { SeriesService } from './series.service';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  getSeries(): Promise<Series[]> {
    return this.seriesService.getSeries();
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

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateOrderSeriesPost(@Req() req): Promise<Series> {
    return;
  }
}
