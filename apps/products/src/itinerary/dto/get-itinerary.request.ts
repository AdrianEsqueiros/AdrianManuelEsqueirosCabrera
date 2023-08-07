import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetItineraryRequest {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  id: number;
}
