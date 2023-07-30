import {Injectable, UnprocessableEntityException} from "@nestjs/common";
import {BussesRepository} from "./busses.reporsitory";
import {CreateBusRequest} from "./dto/create-bus.request";
import {CreateUserRequest} from "../../../auth/src/users/dto/create-user.request";
import {User} from "../../../auth/src/users/schemas/user.schema";
import {Bus} from "./schemas/bus.schema";

@Injectable()
export class BussesService {
    constructor(
        private readonly bussesRepository: BussesRepository) {}

    async createBus(request: CreateBusRequest, authentication: string) {
        await this.validateCreateBusRequest(request);
        const session = await this.bussesRepository.startTransaction();
        try {
            const order = await this.bussesRepository.create(request, { session });
            await session.commitTransaction();
            return order;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    }
    private async validateCreateBusRequest(request: CreateBusRequest) {
        let bus: Bus;
        try {
            bus = await this.bussesRepository.findOne({
                licensePlate: request.licensePlate,
            });
        } catch (err) {}

        if (bus) {
            throw new UnprocessableEntityException('License plate already exists.');
        }
    }
    async getBuses() {
        return this.bussesRepository.find({});
    }
}
