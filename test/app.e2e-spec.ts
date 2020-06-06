import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /register with valid user shoudl register ', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send({ email: 'test@email.com', password: 'test' })
      .expect(201);
  });
  it('POST /register with already registered user shoudl return 400', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send({ email: 'test@email.com', password: 'test' })
      .expect(400);
  });
  it('POST /login with registered user and valid credentials should return token', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ email: 'test@email.com', password: 'test' })
      .expect(200);
  });
  it('POST /login for wrong credential should return 400', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ email: 'test@email.com', password: 'testr43' })
      .expect(400);
  });
});
