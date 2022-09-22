import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Book } from './book.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  isFree: boolean;

  @ManyToMany(() => Book)
  @JoinTable({ name: 'user_books' })
  books: Book[];
}