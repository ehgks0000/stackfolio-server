import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/type-orm.config';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { config, mailConfig } from './config/configuration';
import { TagsModule } from './tags/tags.module';
import { SeriesModule } from './series/series.module';
import { QuestionModule } from './question/question.module';
import { FilesModule } from './files/files.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailConfig),
    AuthModule,
    UsersModule,
    PostsModule,
    MailModule,
    TagsModule,
    SeriesModule,
    QuestionModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
