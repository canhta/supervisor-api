import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { RoleEnum } from 'src/modules/roles/roles.enum';
import { Status } from 'src/utils/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], { message: 'emailAlreadyExists' })
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  fullName: string | null;

  @ApiProperty({ enum: RoleEnum })
  role?: RoleEnum | null;

  @ApiProperty({ enum: Status })
  status?: Status | null;

  hash?: string | null;
}
