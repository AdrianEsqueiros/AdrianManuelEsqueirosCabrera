import {Injectable, Logger} from "@nestjs/common";
import {AbstractRepository} from "@app/common";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {Billing} from "./schemas/billing.schema";

@Injectable()
export class BillingsRepository extends AbstractRepository<Billing> {
    protected readonly logger = new Logger(BillingsRepository.name);

    constructor(
        @InjectModel(Billing.name) billingModel: Model<Billing>,
        @InjectConnection() connection: Connection,
    ) {
        super(billingModel, connection);
    }
}
