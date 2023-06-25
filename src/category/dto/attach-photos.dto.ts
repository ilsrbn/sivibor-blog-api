import { IsArray } from 'class-validator';

export class AttachPhotosDto {
  @IsArray()
  photos: number[];
}
