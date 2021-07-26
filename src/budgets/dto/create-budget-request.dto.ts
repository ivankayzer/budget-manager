import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { UserDto } from '../../auth/dto/user.dto';
import { RepeatFrequency } from '../interfaces/repeat-frequency';
import { Validate } from '../../custom-validator';

export class CreateBudgetRequest extends UserDto {
  @IsDateString()
  start: string;

  @Validate(
    (value, args: CreateBudgetRequest) => value && args.start < args.end,
    { message: "can't be before start date" },
  )
  @Validate((value, args: CreateBudgetRequest) => value && !args.rollover, {
    message: "can't be used with rollover",
  })
  @Validate(
    (value, args: CreateBudgetRequest) =>
      value && args.repeat === RepeatFrequency.none,
    { message: "can't be used with repeat" },
  )
  @IsOptional()
  @IsDateString()
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
