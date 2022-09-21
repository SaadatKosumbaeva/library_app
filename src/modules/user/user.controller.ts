import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { QueryParams } from '../../shared/interfaces/query-params.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get-all')
  @ApiQuery({ type: String, name: 'name', required: false })
  @ApiQuery({ type: Number, name: 'take', required: false })
  @ApiQuery({ type: Number, name: 'page', required: false })
  @ApiQuery({ type: String, name: 'dateFrom', required: false })
  @ApiQuery({ type: String, name: 'dateTo', required: false })
  async getAllUsers(@Query() query: QueryParams) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiParam({type: Number, name: 'id'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({type: Number, name: 'id'})
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({type: Number, name: 'id'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
