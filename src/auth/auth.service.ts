import {
  BadRequestException,
  Injectable,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repository/user.repository';
import { RegisterRepository } from './repository/register.repository';
import { VerificationRepository } from './repository/verification.repository';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly registerRepository: RegisterRepository,
    private readonly verificationRepository: VerificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(data: CreateUserDto): Promise<LoginDto> {
    const newUser = await this.userRepository.createUser(data);

    return {
      profile: newUser.profile,
      accessToken: this.jwtService.sign({ userId: newUser.id }),
    };
  }

  // eslint-disable-next-line
  async socialLogin(@Req() req, @Res() res): Promise<LoginDto> {
    const { provider, social_id, email } = req.user;
    this.logger.verbose(`New social login [${email}]`);
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      const register = await this.registerRepository.createRegister({
        provider,
        social_id,
        email,
      });
      const client = 'http://localhost:4000'; /** @todo Update to client url */
      const redirectUrl = `${client}/register?code=${register.code}&email=${register.email}`;
      console.log('소셜로그인', redirectUrl);
      this.logger.verbose(`New social login [${redirectUrl}]`);

      return res.redirect(redirectUrl);
      //   return res.redirect(encodeURI(redirectUrl));
    }

    return {
      profile: user.profile,
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  // For users who create with there personal mail
  async sendRegisterMail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new BadRequestException('이미 회원가입된 email입니다.', email);
    }

    let register = await this.registerRepository.findOne({ email });
    if (!register) {
      register = await this.registerRepository.createRegister({ email });
    }

    const client = 'http://localhost:4000'; /** @todo Update to client url */
    const redirectUrl = `${client}/register?code=${register.code}&email=${register.email}`;

    this.mailService.sendRegisterMail(email, redirectUrl);
  }

  async sendLoginMail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    let verification = await this.verificationRepository.findOne({
      user_id: user.id,
    });
    if (!verification) {
      verification = this.verificationRepository.create({ user });
      await this.verificationRepository.save(verification);
    }

    const client = 'http://localhost:4000'; /** @todo Update to client url */
    const redirectUrl = `${client}/verify?code=${verification.code}`;

    this.mailService.sendLoginMail(email, redirectUrl);
  }

  async loginWithCode(code: string): Promise<LoginDto> {
    const userProfile = await this.verificationRepository.verifyCodeAndGetUserProfile(
      code,
    );
    if (!userProfile.user_id) {
      throw new BadRequestException('유저 프로필이 없습니다');
    }
    // const accessToken = this.jwtService.sign({ userId: user_id });
    // console.log('유저프로필 토큰 출력 : ', accessToken);
    return {
      //   profile: user_id,
      profile: userProfile,
      accessToken: this.jwtService.sign({ userId: userProfile.user_id }),
    };
  }
}
