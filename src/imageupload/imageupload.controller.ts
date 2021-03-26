import { Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { ImageuploadService } from './imageupload.service';

@Controller('imageupload')
export class ImageuploadController {
  constructor(private readonly imageUploadService: ImageuploadService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Res() res): Promise<UserProfile> {
    return this.imageUploadService.fileupload(req, res);
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  delete(@Req() req, @Res() res): Promise<void> {
    return this.imageUploadService.deleteupload(req, res);
  }

  //테스트
  //   @Post('upload')
  //   @UseGuards(JwtAuthGuard)
  //   @UseInterceptors(
  //     FileFieldsInterceptor([
  //       { name: 'avatar', maxCount: 10 },
  //       { name: 'background', maxCount: 1 },
  //     ]),
  //   )
  //   uploadFiles(@Req() req, @UploadedFiles() files: Express.Multer.File) {
  //     return this.imageUploadService.uploadFiles(req, files);
  //   }
}
