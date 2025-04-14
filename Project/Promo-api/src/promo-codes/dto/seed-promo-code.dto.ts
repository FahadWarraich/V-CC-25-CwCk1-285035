import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';
export class SeedPromoCodesDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one promo code is required' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  codes: string[];
}
