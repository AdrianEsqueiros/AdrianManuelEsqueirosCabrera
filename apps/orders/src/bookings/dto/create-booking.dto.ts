import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { SeatType } from '../enums/seatType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: '1',
    description: 'Id of the itinerary',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsNumber()
  itineraryId: number;
  @ApiProperty({
    example: 'Ejecutivo',
    description: 'Type of seat',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsEnum(SeatType)
  seatType: string;
  @ApiProperty({
    example: '2',
    description: 'Number of seats',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  seatsCount: number;
}
