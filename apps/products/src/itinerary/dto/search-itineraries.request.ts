import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provinces } from '../enums/provinces';
import { Column } from 'typeorm';

export class SearchItinerariesRequest {
  @ApiProperty({ enum: Provinces, description: 'Origin city of the itinerary' })
  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  originCity: string;

  @ApiProperty({
    enum: Provinces,
    description: 'Destination city of the itinerary',
  })
  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  destinationCity: string;
}
