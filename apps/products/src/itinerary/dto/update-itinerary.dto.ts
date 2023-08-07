import {
  IsDateString, IsEnum, IsInt,
  IsNotEmpty, IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {Column} from "typeorm";
import {Bus} from "../../busses/entities/bus.entity";
import {Provinces} from "../enums/provinces";
import {ApiProperty} from "@nestjs/swagger";

export class CreateItineraryDto {

  @ApiProperty({ enum: Provinces, description: 'Origin city of the itinerary' })
  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  originCity: string;

  @ApiProperty({ enum: Provinces, description: 'Destination city of the itinerary' })
  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  destinationCity: string;

  @ApiProperty({ type: Date, description: 'Departure time of the itinerary' })
  @Column()
  @IsNotEmpty()
  @IsDateString()
  departureTime: Date;

  @ApiProperty({ type: Date, description: 'Arrival time of the itinerary' })
  @Column()
  @IsNotEmpty()
  @IsDateString()
  arrivalTime: Date;

  @ApiProperty({ type: Number, description: 'Price of the itinerary', minimum: 0 })
  @Column()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  bus:Bus;

}
