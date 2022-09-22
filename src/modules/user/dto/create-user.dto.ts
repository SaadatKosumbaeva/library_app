import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

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
  @Min(0, {
    message: 'Age should not be a negative number',
  })
  age: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean = true;
}
