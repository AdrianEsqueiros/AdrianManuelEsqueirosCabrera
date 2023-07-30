import {Injectable, Logger} from "@nestjs/common";
import {AbstractRepository} from "@app/common";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {Itinerary} from "./schemas/itinerary.schema";

@Injectable()
export class ItinerariesRepository extends AbstractRepository<Itinerary>
{
    protected readonly logger = new Logger(ItinerariesRepository.name);

    constructor(
        @InjectModel(Itinerary.name) itineraryModel: Model<Itinerary>,
        @InjectConnection() connection: Connection,
    ) {
        super(itineraryModel, connection);
    }
}