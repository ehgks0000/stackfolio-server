import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Open API
export const setSwagger = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('StackFolio API')
    .setDescription('StackFolio API specification')
    .setVersion('1.4')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
