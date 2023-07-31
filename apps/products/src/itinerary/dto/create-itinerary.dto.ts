import {
  IsDateString, IsEnum, IsInt,
  IsNotEmpty, IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {Column, Entity} from "typeorm";
import {Bus} from "../../busses/entities/bus.entity";
import {Provinces} from "../enums/provinces";

export class CreateItineraryDto {

  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  origin_city: string;

  @Column()
  @IsNotEmpty()
  @IsEnum(Provinces)
  destination_city: string;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  departure_time: Date;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  arrival_time: Date;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  bus:Bus;

}
