import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  app.use(
    session({
      secret: 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(3000);
}
bootstrap();