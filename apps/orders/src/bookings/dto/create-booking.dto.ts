import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import {SeatType} from "../enums/seatType";

export class CreateBookingDto {
    @IsNotEmpty()
    @IsNumber()
    itinerary_id: number;

    @IsNotEmpty()
    @IsEnum(SeatType)
    seat_type:string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    seats_count: number;

}
