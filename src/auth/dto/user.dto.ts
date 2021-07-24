import { ApiHideProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiHideProperty()
  @IsString()
  userId: string;
}
