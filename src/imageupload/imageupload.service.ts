import { Injectable, Req, Res } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

// const ss = ConfigService.length();
const AWS_S3_BUCKET_NAME = 'mystackfolio';
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: 'AKIAT3SNX4UMPZWL56P7',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
});
// const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
// const s3 = new AWS.S3();

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: 'ap-northeast-2',
// });
@Injectable()
export class ImageuploadService {
  constructor(
    // private configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, (e) => {
        if (e) {
          console.log(e);
          return res.status(404).json(`${e}`);
        }
        // console.log(req.files[0].location);
        // 유저 프로필 avatar 여기다 저장
        // const user = awaot this.userRepository.findOne({id: req.user.id});
        //user.profile.avatar = req.files[0].location;
        // await user.save();
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
