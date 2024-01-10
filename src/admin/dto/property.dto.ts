import { PropertyType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class PropertyDto {
    @IsNotEmpty()
    @IsEnum(PropertyType)
    type: PropertyType;

    @IsArray()
    @ValidateNested()
    @Type(() => Floor)
    floors: Floor[];
}

class Floor {
    @IsString()
    name: string;

    @IsArray()
    @ValidateNested()
    @Type(() => Rooms)
    rooms: Rooms[];
}

class Rooms {
    @IsString()
    name: string;
}

export class PropertyTypes {
    @IsEnum(PropertyType)
    type: PropertyType
}