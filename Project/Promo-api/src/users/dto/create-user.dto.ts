import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User contact number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  contactNumber: string;

  @ApiProperty({
    description: 'Promotional code from flyer',
    example: 'B448DF1F3C',
  })
  @IsString()
  @IsNotEmpty()
  promoCode: string;
}
