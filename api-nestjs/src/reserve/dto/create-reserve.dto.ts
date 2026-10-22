import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReserveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  note?: string;

  @IsBoolean()
  @Equals(true, {
    message: 'You must accept the Terms & Conditions and Privacy Policy',
  })
  consent: boolean;
}
