import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { StreamStatus } from 'src/utils/enums';

export class CreateStreamDto {
  @ApiProperty({ example: 'stream_1' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ha noi' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ enum: StreamStatus, default: StreamStatus.Idle })
  status?: StreamStatus;

  @ApiProperty({ type: [String] })
  viewerIDs: string[];
}
