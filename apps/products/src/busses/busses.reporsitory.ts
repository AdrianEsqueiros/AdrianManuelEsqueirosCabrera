import {Injectable, Logger} from "@nestjs/common";
import {AbstractRepository} from "@app/common";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {Bus} from "./schemas/bus.schema";

@Injectable()
export class BussesRepository extends AbstractRepository<Bus>
{
    protected readonly logger = new Logger(BussesRepository.name);

    constructor(
        @InjectModel(Bus.name) busModel: Model<Bus>,
        @InjectConnection() connection: Connection,
    ) {
        super(busModel, connection);
    }
}