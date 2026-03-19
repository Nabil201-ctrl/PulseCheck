import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/check (POST) without URL', () => {
    return request(app.getHttpServer())
      .post('/check')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('URL is required');
      });
  });

  it("/health(GET)", ()=>{
    return request(app.getHttpServer())
    .get("/health")
    .expect(200)
    .expect((res)=>{
      expect(res.body).toBeDefined();
    } )
  })
});
