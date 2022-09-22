import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParams } from '../../shared/interfaces/query-params.interface';
import { SortType } from '../../shared/types/sort-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { EntityStatus } from '../../shared/types/entity-status';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
              private readonly userRepository: Repository<User>) {
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async findAll({ name = '', take = 10, page = 1, dateFrom, dateTo, sortType = SortType.DESC }: QueryParams) {
    const preparedName = name.trim().replace(/\s\s+/g, ' ');
    const skip = page === 1 ? 0 : (page - 1) * take;
    const query = this.userRepository.createQueryBuilder('user')
      .orderBy('user.createdAt', sortType)
      .leftJoinAndSelect('user.books', 'book')
      .andWhere(`user.status != ${ EntityStatus.DELETED }`);

    if (preparedName) {
      query.andWhere('LOWER(user.firstName) like :name', { name: `%${ preparedName.toLowerCase() }%` })
        .orWhere('LOWER(user.lastName) like :name', { name: `%${ preparedName.toLowerCase() }%` });
    }

    if (dateFrom) {
      query.andWhere('user.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      query.andWhere('user.createdAt <= :dateTo', { dateTo });
    }

    return query
      .take(take)
      .skip(skip)
      .getManyAndCount();
  }

  async findOne(id: number) {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere(`user.status != ${ EntityStatus.DELETED }`)
      .leftJoinAndSelect('user.books', 'book')
      .getOne();

    return this.checkUserExist(id, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUserData = await this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUserData);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    user.status = EntityStatus.DELETED;
    return await this.userRepository.save(user);
  }

  checkUserExist(id: number, user: User) {
    if (!user) {
      throw new NotFoundException(`User by id = ${ id } not found`);
    }
    return user;
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
