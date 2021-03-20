import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageuploadService } from './imageupload.service';

@Controller('imageupload')
export class ImageuploadController {
  constructor(private readonly imageUploadService: ImageuploadService) {}

  @Post('')
  async create(@Req() req, @Res() res) {
    try {
      await this.imageUploadService.fileupload(req, res);
    } catch (error) {
      return res
        .status(500)
        .json(`failed to upload image file : ${error.message}`);
    }
  }
}
