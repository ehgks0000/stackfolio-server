import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.string().required(),

  JWT_KEY: Joi.string().required(),

  PASSPORT_GOOGLE_CLIENT_ID: Joi.string().required(),
  PASSPORT_GOOGLE_CLIENT_SECRET: Joi.string().required(),
  PASSPORT_GOOGLE_CALLBACK_URL: Joi.string().required(),

  G_MAIL_ID: Joi.string().required(),
  G_MAIL_CLIENT_ID: Joi.string().required(),
  G_MAIL_CLIENT_SECRET: Joi.string().required(),
  G_MAIL_REFRESH_TOKEN: Joi.string().required(),

  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
});

/** @todo Add client host */
const allowedHosts = ['http://localhost:4000'];

const configuration = () => ({
  port: process.env.PORT,
  test: process.env.G_MAIL_CLIENT_ID,
  ['allowed-hosts']: allowedHosts,
  ['jwt-key']: process.env.JWT_KEY,
  passport: {
    google: {
      ['client-id']: process.env.PASSPORT_GOOGLE_CLIENT_ID,
      ['client-secret']: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
      ['callback-url']: process.env.PASSPORT_GOOGLE_CALLBACK_URL,
    },
    mail: {
      ['id']: process.env.G_MAIL_ID,
      ['client-id']: process.env.G_MAIL_CLIENT_ID,
      ['client-secret']: process.env.G_MAIL_CLIENT_SECRET,
      ['refresh-token']: process.env.G_MAIL_REFRESH_TOKEN,
    },
  },
  aws: {
    ['bucketname']: process.env.AWS_S3_BUCKET_NAME,
    ['id']: process.env.AWS_ACCESS_KEY_ID,
    ['secretkey']: process.env.AWS_SECRET_ACCESS_KEY,
    ['region']: process.env.AWS_REGION,
  },
});

const isProd = process.env.NODE_ENV === 'production';

export const config: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvFile: isProd,
  validationSchema,
  load: [configuration],
};
// configuration().passport.mail['client-id'];

export const mailConfig = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.G_MAIL_ID,
      clientId: process.env.G_MAIL_CLIENT_ID,
      clientSecret: process.env.G_MAIL_CLIENT_SECRET,
      refreshToken: process.env.G_MAIL_REFRESH_TOKEN,
    },
  },
};
