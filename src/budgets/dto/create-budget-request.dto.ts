import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserDto } from '../../auth/dto/user.dto';
import { RepeatFrequency } from '../interfaces/repeat-frequency';

export class CreateBudgetRequest extends UserDto {
  @IsString()
  start: string;

  @ValidateIf(
    (budget) => !budget.rollover && budget.repeat === RepeatFrequency.none,
  )
  @IsString()
  end: string;

  @IsInt()
  amount: number;

  @IsArray()
  categoryIds: number[];

  @IsBoolean()
  rollover: boolean;

  @IsEnum(RepeatFrequency)
  repeat: RepeatFrequency;
}
