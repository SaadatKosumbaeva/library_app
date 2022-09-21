import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2, {
    message: 'Last name must be longer or equal to 2 characters',
  })
  @IsString()
  firstName: string;

  @MinLength(2, {
    message: 'Last name must be longer or equal to 2 characters',
  })
  @IsString()
  lastName: string;

  @IsInt()
  age: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean = true;
}
