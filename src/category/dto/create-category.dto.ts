import {IsBoolean, IsOptional, IsString} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  posted?: boolean = false
}
