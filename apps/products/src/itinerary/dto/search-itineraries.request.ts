import {IsNotEmpty, IsString} from "class-validator";
import {now} from "mongoose";

export class SearchItinerariesRequest {
    @IsNotEmpty()
    @IsString()
    originCity: string;
    @IsNotEmpty()
    @IsString()
    destinationCity: string;

}