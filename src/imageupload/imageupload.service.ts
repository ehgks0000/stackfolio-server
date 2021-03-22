import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entity/user-profile.entity';

// const ss = ConfigService.length();
const AWS_S3_BUCKET_NAME = 'mystackfolio';
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: 'AKIAT3SNX4UMPZWL56P7',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
});

@Injectable()
export class ImageuploadService {
  constructor(
    // private configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async fileupload(@Req() req, @Res() res): Promise<UserProfile> {
    try {
      this.upload(req, res, async (e) => {
        if (e) {
          console.log(e);
          return res.status(404).json(`${e}`);
        }

        // 유저 프로필 avatar 여기다 저장
        let userProfile = await this.userProfileRepository.findOne({
          user_id: req.user.id,
        });
        userProfile = {
          ...userProfile,
          avatar: req.files[0].location,
        };

        await this.userProfileRepository.save(userProfile);

        return res.json(userProfile);
      });
    } catch (error) {
      console.log(error);
      return res.json(`${error}`);
    }
  }

  async deleteupload(@Req() req, @Res() res): Promise<UserProfile> {
    let userProfile = await this.userProfileRepository.findOne({
      user_id: req.user.id,
    });
    if (!userProfile.avatar) {
      throw new BadRequestException();
    }

    const url = userProfile.avatar.split('/');
    const delFileName = url[url.length - 1];

    console.log('delFileName' + delFileName);

    s3.deleteObject(
      { Bucket: AWS_S3_BUCKET_NAME, Key: delFileName },
      async (err, data) => {
        if (err) {
          throw new BadRequestException(err);
        }

        userProfile = {
          ...userProfile,
          avatar: null,
        };
        await this.userProfileRepository.save(userProfile);
      },
    );
    return res.json(userProfile);
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
