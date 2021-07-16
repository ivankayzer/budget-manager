import { IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    userId: string;
}