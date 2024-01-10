import { IsOptional, IsString } from "class-validator";

export class FilterDto {
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    floor: string;
    
    @IsOptional()
    @IsString()
    room?: string;

}