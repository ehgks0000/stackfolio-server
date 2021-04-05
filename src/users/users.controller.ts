import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile } from './entity/user-profile.entity';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import docs from './users.docs';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.delete['user'].operation)
  @ApiOkResponse(docs.delete['user'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  // eslint-disable-next-line
  deleteUser(@Req() req): Promise<User> {
    return this.usersService.deleteUser(req.user);
  }

  @Get('profile/:user_id')
  @ApiOperation(docs.get['profile/:user_id'].operation)
  @ApiOkResponse(docs.get['profile/:user_id'].response[200])
  @ApiBadRequestResponse(docs.get['profile/:user_id'].response[400])
  getUserProfile(
    @Param('user_id') userId: string,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getUserProfile(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.patch['profile'].operation)
  @ApiOkResponse(docs.patch['profile'].response[200])
  @ApiBadRequestResponse(docs.patch['profile'].response[400])
  @ApiConflictResponse(docs.patch['profile'].response[409])
  @ApiUnauthorizedResponse(docs.unauthorized)
  updateUserProfile(
    // eslint-disable-next-line
    @Req() req,
    @Body() data: UpdateUserDto,
  ): Promise<UserProfile> {
    return this.usersService.updateUserProfile(req.user.id, data);
  }

  @Get('followers/:user_id')
  @ApiOperation(docs.get['followers/:user_id'].operation)
  @ApiOkResponse(docs.get['followers/:user_id'].response[200])
  @ApiBadRequestResponse(docs.get['followers/:user_id'].response[400])
  getFollowers(@Param('user_id') userId: string): Promise<User[]> {
    return this.usersService.getFollowers(userId);
  }

  @Get('followings/:user_id')
  @ApiOperation(docs.get['followings/:user_id'].operation)
  @ApiOkResponse(docs.get['followings/:user_id'].response[200])
  @ApiBadRequestResponse(docs.get['followings/:user_id'].response[400])
  getFollowings(@Param('user_id') userId: string): Promise<User[]> {
    return this.usersService.getFollowings(userId);
  }

  @Post('follow/:user_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['follow/:user_id'].operation)
  @ApiOkResponse(docs.post['follow/:user_id'].response[200])
  @ApiBadRequestResponse(docs.post['follow/:user_id'].response[400])
  @ApiUnauthorizedResponse(docs.unauthorized)
  // eslint-disable-next-line
  getFollowing(@Req() req, @Param('user_id') userId: string): Promise<void> {
    return this.usersService.follow(req.user, userId);
  }

  @Delete('follow/:user_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.delete['follow/:user_id'].operation)
  @ApiOkResponse(docs.delete['follow/:user_id'].response[200])
  @ApiBadRequestResponse(docs.delete['follow/:user_id'].response[400])
  @ApiUnauthorizedResponse(docs.unauthorized)
  // eslint-disable-next-line
  unFollowing(@Req() req, @Param('user_id') userId: string): Promise<void> {
    return this.usersService.unFollow(req.user.id, userId);
  }

  // test
  //   @ApiOkResponse(docs.patch['profile'].response[200])
  //   @ApiBadRequestResponse(docs.patch['profile'].response[400])
  //   @ApiConflictResponse(docs.patch['profile'].response[409])

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'avatar image',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @ApiOkResponse(docs.post['upload'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  @UseInterceptors(
    FileInterceptor('image', {
      //   storage: diskStorage({}),
      //   fileFilter: (req, file, cb) => {
      //     file.encoding = 'image/png';
      //     file.fieldname = 'image';
      //     file.mimetype = 'image/png';
      //     cb(null, true);
      //   },
    }),
  )
  uploadFile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserProfile> {
    return this.usersService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse(docs.delete['upload'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deleteFile(@Req() req): Promise<void> {
    return this.usersService.deleteAvatar(req.user.id);
  }

  // // 팔로워 끊기
  // @Delete('follower/:user_id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation(docs.delete['follower/:user_id'].operation)
  // @ApiOkResponse(docs.delete['follower/:user_id'].response[200])
  // @ApiBadRequestResponse(docs.delete['follower/:user_id'].response[400])
  // @ApiUnauthorizedResponse(docs.unauthorized)
  // // eslint-disable-next-line
  // unFollower(@Req() req, @Param('user_id') userId: string): Promise<User[]> {
  //   return this.usersService.unFollower(req.user.id, userId);
  // }

  // @Get('favorites')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation(docs.get['favorites'].operation)
  // @ApiOkResponse(docs.get['favorites'].response[200])
  // @ApiUnauthorizedResponse(docs.unauthorized)
  // // eslint-disable-next-line
  // getFavorites(@Req() req): Promise<Favorite[]> {
  //   /** @todo */
  //   return this.usersService.getFavorites(req.user.id);
  // }

  // @Get('favorite/:post_id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation(docs.get['favorite/:post_id'].operation)
  // @ApiOkResponse(docs.get['favorite/:post_id'].response[200])
  // @ApiBadRequestResponse(docs.get['favorite/:post_id'].response[400])
  // @ApiUnauthorizedResponse(docs.unauthorized)
  // addFavorite(
  //   // eslint-disable-next-line
  //   @Req() req,
  //   @Param('post_id') post_id: string,
  // ): Promise<Favorite> {
  //   return this.usersService.addFavorite(req.user.id, post_id);
  // }

  // @Delete('favorite/:favorite_id')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation(docs.delete['favorite/:favorite_id'].operation)
  // @ApiOkResponse(docs.delete['favorite/:favorite_id'].response[200])
  // @ApiBadRequestResponse(docs.delete['favorite/:favorite_id'].response[400])
  // @ApiUnauthorizedResponse(docs.unauthorized)
  // deleteFavorite(
  //   // eslint-disable-next-line
  //   @Req() req,
  //   @Param('favorite_id') favorite_id: string,
  // ): Promise<Favorite> {
  //   return this.usersService.deleteFavorite(req.user.id, favorite_id);
  // }
}
