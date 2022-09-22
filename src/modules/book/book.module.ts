import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from '../../entities/book.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    UserModule,
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {
}
