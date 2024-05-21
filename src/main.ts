import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet setup
  // app.use(helmet());

  // Cookie Parser setup
  app.use(cookieParser());

  // CSRF protection setup
  // app.use(csurf({ cookie: true }));

  // Rate Limiter setup
  const rateLimiter = new RateLimiterMemory({
    points: 10, // Number of points
    duration: 1, // Per second
  });

  app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  });

  // CORS setup

  app.enableCors({
    origin: 'p', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
