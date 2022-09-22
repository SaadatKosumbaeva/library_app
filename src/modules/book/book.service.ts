import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '../../entities/book.entity';
import { QueryParams } from '../../shared/interfaces/query-params.interface';
import { SortType } from '../../shared/types/sort-type';
import { EntityStatus } from '../../shared/types/entity-status';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class BookService {
  constructor(@InjectRepository(Book)
              private readonly bookRepository: Repository<Book>,
              private readonly userService: UserService) {
  }

  async create(createBookDto: CreateBookDto) {
    const existBook = await this.getByMultipleParameters(createBookDto);

    if (existBook) throw new HttpException('The book already exist', HttpStatus.CONFLICT);

    const book = await this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll({ name = '', take = 10, page = 1, dateFrom, dateTo, sortType = SortType.DESC }: QueryParams) {
    const preparedName = name.trim().replace(/\s\s+/g, ' ');
    const skip = page === 1 ? 0 : (page - 1) * take;
    const query = this.bookRepository.createQueryBuilder('book')
      .orderBy('book.createdAt', sortType)
      .andWhere(`book.status != ${ EntityStatus.DELETED }`);

    if (preparedName) {
      query.andWhere('LOWER(book.title) like :title', { title: `%${ preparedName.toLowerCase() }%` })
        .orWhere('LOWER(book.author) like :author', { author: `%${ preparedName.toLowerCase() }%` });
    }

    if (dateFrom) {
      query.andWhere('book.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      query.andWhere('book.createdAt <= :dateTo', { dateTo });
    }

    return query
      .take(take)
      .skip(skip)
      .getManyAndCount();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.createQueryBuilder('book')
      .where('book.id = :id', { id })
      .andWhere(`book.status != ${ EntityStatus.DELETED }`)
      .getOne();

    if (!book) {
      throw new NotFoundException(`Book by id = ${ id } not found`);
    }
    return book;
  }

  async getByMultipleParameters(createBookDto: CreateBookDto) {
    return this.bookRepository.createQueryBuilder('book')
      .where('book.title = :title', { title: createBookDto.title })
      .andWhere('book.author = :author', { author: createBookDto.author })
      .getOne();
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    const updatedBookData = await this.bookRepository.merge(book, updateBookDto);
    return this.bookRepository.save(updatedBookData);
  }

  async addToFavorite(bookId: number, updateUserDto: UpdateUserDto) {
    const book = await this.findOne(bookId);
    const user = await this.userService.findOne(updateUserDto.userId);

    const existBook = user.books.find(b => b.id === bookId);

    if (existBook) {
      user.books = user.books.filter(b => b.id !== bookId);
      return this.userService.save(user);
    }

    user.books.push(book);
    return this.userService.save(user);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    book.status = EntityStatus.DELETED;
    return this.bookRepository.save(book);
  }
}
