import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Global() // Делает модуль глобальным
@Module({
  providers: [DbService],
  exports: [DbService], // Экспортирует для использования в других модулях
})
export class DbModule {}