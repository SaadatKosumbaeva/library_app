import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [ConfigModule.forRoot(), DbModule, UserModule, BookModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
