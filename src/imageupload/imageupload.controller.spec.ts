import { Test, TestingModule } from '@nestjs/testing';
import { ImageuploadController } from './imageupload.controller';

describe('ImageuploadController', () => {
  let controller: ImageuploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageuploadController],
    }).compile();

    controller = module.get<ImageuploadController>(ImageuploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
