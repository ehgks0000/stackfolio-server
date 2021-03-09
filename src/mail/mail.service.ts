import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(readonly mailerService: MailerService) {}

  private sendMail(to: string, subject: string, content: string): void {
    this.mailerService
      .sendMail({
        to,
        from: 'ehgks00832@gmail.com',
        subject,
        html: content,
      })
      .then((s) => {
        // this.logger.verbose(`email 발송 성공 [${email}]`);
        // console.log("이메일 발송 성공",s);
      })
      .catch((e) => {
        // console.log("이메일 발송 에러",e);
      });
  }

  sendRegisterMail(to: string, redirectUrl: string): void {
    const subject = 'StackFolio 회원가입';
    const content = `<a href=${redirectUrl}>회원가입</a>`;
    this.sendMail(to, subject, content);
  }

  sendLoginMail(to: string, redirectUrl: string): void {
    const subject = 'StackFolio 로그인';
    const content = `<a href=${redirectUrl}>로그인</a>`;
    this.sendMail(to, subject, content);
  }

  public sendingMail(email: string, redirectUrl: string): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'ehgks00832@gmail.com',
        subject: 'Velog 회원가입 링크입니다',
        html: `<h1>h1 테스트</h1>
        <a href=${redirectUrl}>${redirectUrl}</a>`,
      })
      .then((s) => {
        // this.logger.verbose(`email 발송 성공 [${email}]`);
        // console.log("이메일 발송 성공",s);
      })
      .catch((e) => {
        // console.log("이메일 발송 에러",e);
      });
  }
}
