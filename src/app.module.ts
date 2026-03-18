import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, ThrottlerModule.forRoot([
    {
      ttl: 60000,
      limit: 5,
    },
  ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
