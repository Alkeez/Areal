import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 10. Глобальный префикс
  app.setGlobalPrefix('api');
  
  // 14. Подключение ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет поля, которых нет в DTO
    forbidNonWhitelisted: true, // Блокирует запрос с лишними полями
  }));

  await app.listen(3000);
}
bootstrap();