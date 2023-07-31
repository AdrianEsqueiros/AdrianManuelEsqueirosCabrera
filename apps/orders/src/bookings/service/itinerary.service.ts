import {BadRequestException, Injectable} from "@nestjs/common";
import axios from 'axios';
@Injectable()
export class ItineraryService {
    async getItineraryById(itineraryId: number): Promise<any> {
        try{
            const response = await axios.get(
                `http://products:3002/itineraries/${itineraryId}`,
            );
            if (!response.data){
                throw new BadRequestException('Request failed with status code ' );
            }
            return response.data;
        }
        catch (e){
        }

    }
}