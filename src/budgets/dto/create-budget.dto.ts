import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  userId: string;

  @IsString()
  start: string;

  @IsOptional()
  @IsString()
  end: string | undefined;

  @IsInt()
  amount: number;

  @IsArray()
  categoryIds: number[];

  @IsOptional()
  @IsBoolean()
  rollover: boolean | undefined;

  @IsIn(['monthly', 'weekly', 'none'])
  repeat: 'monthly' | 'weekly' | 'none';
}
