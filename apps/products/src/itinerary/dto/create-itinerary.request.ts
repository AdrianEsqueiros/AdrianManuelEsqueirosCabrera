import {
  IsDateString,
  IsNotEmpty, IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {Types} from "mongoose";

export class CreateItineraryRequest {
  @IsNotEmpty()
  @IsString()
  originCity: string;

  @IsNotEmpty()
  @IsString()
  destinationCity: string;

  @IsNotEmpty()
  @IsDateString()
  departureTime: Date;

  @IsNotEmpty()
  @IsDateString()
  arrivalTime: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  busId: string;
}
