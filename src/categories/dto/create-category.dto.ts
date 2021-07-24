import { IsString } from "class-validator";
import { UserDto } from "src/auth/dto/user.dto";

export class CreateCategoryDto extends UserDto {
    @IsString()
    name: string;
}