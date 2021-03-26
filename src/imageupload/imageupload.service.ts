import { Injectable, Req, Res } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
// import S3 from 'aws-sdk/clients/s3';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entity/user-profile.entity';
@Injectable()
export class ImageuploadService {
  private s3: any;
  private upload: any;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
  ) {
    this.s3 = new AWS.S3();

    AWS.config.update({
      accessKeyId: this.configService.get<string>('aws.[id]'),
      secretAccessKey: this.configService.get<string>('aws.[secretkey]'),
      region: this.configService.get<string>('aws.[region]'),
    });

    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.configService.get<string>('aws.[bucketname]'),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        acl: 'public-read',
        key: (req, file, cb) => {
          cb(null, req.user.id);
        },
      }),
    }).array('upload');
  }
  //아바타 이미지 (덮어쓰기)
  async fileupload(@Req() req, @Res() res): Promise<UserProfile> {
    const userProfile = await this.userProfileRepository.findOne({
      user_id: req.user.id,
    });

    try {
      this.upload(req, res, async (e) => {
        if (e) {
          console.error(e);
          // throw new BadRequestException(e);
        }
        userProfile.avatar = req.files[0].location;

        await this.userProfileRepository.save(userProfile);
        return res.status(201).json(userProfile);
      });
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async deleteupload(@Req() req, @Res() res): Promise<void> {
    const userProfile = await this.userProfileRepository.findOne({
      user_id: req.user.id,
    });
    if (!userProfile.avatar) {
      console.log('avatar url이 존재 하지않습니다.');
      return res.status(401).json({ error: '' });
    }

    const url = userProfile.avatar.split('/');
    const delFileName = url[url.length - 1];
    userProfile.avatar = null;

    this.s3.deleteObject(
      {
        Bucket: this.configService.get<string>('aws.[bucketname]'),
        Key: delFileName,
      },
      async (err, data) => {
        if (err) {
          console.error(err);
          return res.status(401).json({ err: err });
        }

        await this.userProfileRepository.save(userProfile);
        console.log('삭제삭제삭제');
        return res.status(401).json({ data });
      },
    );
  }
}

//   ACCESS_KEY = this.configService.get<string>('aws.[id]');
//   SECRET_KEY = this.configService.get('aws.[secretkey]');
//   BUCKET_NAME = this.configService.get('aws.[bucketname]');
//   REGION = this.configService.get('aws.[region]');
