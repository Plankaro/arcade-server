import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUsersDto {
  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ids: string[];
}
