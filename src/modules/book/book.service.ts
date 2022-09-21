import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../entities/book.entity';
import { Repository } from 'typeorm';
import { QueryParams } from '../../shared/interfaces/query-params.interface';
import { SortType } from '../../shared/types/sort-type';
import { EntityStatus } from '../../shared/types/entity-status';

@Injectable()
export class BookService {
  constructor(@InjectRepository(Book)
              private readonly bookRepository: Repository<Book>) {
  }

  async create(createBookDto: CreateBookDto) {
    const book = await this.bookRepository.create(createBookDto);
    await this.bookRepository.manager.save(book);
    return book;
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
    return this.bookRepository.createQueryBuilder('book')
      .where('book.id = :id', { id })
      .andWhere(`book.status != ${ EntityStatus.DELETED }`)
      .getOne();
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    this.checkBookExist(id, book);

    const updatedBookData = await this.bookRepository.merge(book, updateBookDto);
    return this.bookRepository.manager.save(updatedBookData);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.checkBookExist(id, book);
    book.status = EntityStatus.DELETED;
    return this.bookRepository.manager.save(book);
  }

  checkBookExist(id: number, book: Book) {
    if (!book) {
      throw new NotFoundException(`Book by id = ${ id } not found`);
    }
    return book;
  }
}
