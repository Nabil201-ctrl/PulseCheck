import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockAppService = {
      checkUrl: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('checkUrl', () => {
    it('should throw an exception if url is missing', async () => {
      await expect(appController.checkUrl('')).rejects.toThrow(HttpException);
    });

    it('should call checkUrl on the service with a valid url', async () => {
      const url = 'https://example.com';
      jest.spyOn(appService, 'checkUrl').mockResolvedValue('resultado');

      const result = await appController.checkUrl(url);

      expect(appService.checkUrl).toHaveBeenCalledWith(url);
      expect(result).toBe('resultado');
    });
  });
});
