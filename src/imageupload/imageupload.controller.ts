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
    try {
      return this.imageUploadService.fileupload(req, res);
    } catch (error) {
      return res
        .status(500)
        .json(`failed to upload image file : ${error.message}`);
    }
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  delete(@Req() req, @Res() res): Promise<UserProfile> {
    return this.imageUploadService.deleteupload(req, res);
  }
}
