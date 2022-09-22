import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryParams } from '../../shared/interfaces/query-params.interface';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiQuery({ type: String, name: 'name', required: false })
  @ApiQuery({ type: Number, name: 'take', required: false })
  @ApiQuery({ type: Number, name: 'page', required: false })
  @ApiQuery({ type: String, name: 'dateFrom', required: false })
  @ApiQuery({ type: String, name: 'dateTo', required: false })
  findAll(@Query() query: QueryParams) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ type: Number, name: 'id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ type: Number, name: 'id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Patch('favorite/:bookId')
  @ApiParam({ type: Number, name: 'bookId' })
  addToFavourite(@Param('bookId', ParseIntPipe) bookId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.bookService.addToFavorite(bookId, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ type: Number, name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
