import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
// import { mailConfig } from 'src/config/mail.config';
import { MailService } from './mail.service';
import { mailConfig } from '../config/configuration';

@Module({
  //   imports: [MailerModule.forRoot(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
