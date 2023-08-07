import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'License plate of the bus',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the bus driver',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  busDriver: string;

  @ApiProperty({
    example: 30,
    description: 'Total number of seats in the bus',
    minimum: 20,
    maximum: 35,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(20)
  @Max(35)
  totalSeats: number;
}
