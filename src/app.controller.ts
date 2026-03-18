import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('check')
  async checkUrl(@Body('url') url: string) {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }
    return this.appService.checkUrl(url);
  }

  @Get('health')
  async healthCheck(): Promise<string> {
    return this.appService.HealthCheck();
  }
}
