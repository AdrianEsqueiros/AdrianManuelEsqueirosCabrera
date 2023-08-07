import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItineraryDto } from './create-itinerary.dto';

export class UpdateItineraryDto extends PartialType(CreateItineraryDto) {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'number' })
  id: number;
}
