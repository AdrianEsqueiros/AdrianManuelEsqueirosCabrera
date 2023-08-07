import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Bus } from './entities/bus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';

@Injectable()
export class BussesService {
  constructor(
    @InjectRepository(Bus)
    private readonly bussesRepository: Repository<Bus>,
    private readonly entityManager: EntityManager,
  ) {}
  async createBus(request: CreateBusDto) {
    await this.validateCreateBusRequest(request);
    const bus = new Bus({
      ...request,
      itineraries: [],
    });
    return await this.entityManager.save(bus);
  }

  async getBuses() {
    return this.bussesRepository.find();
  }

  async findOne(id: number) {
    return this.bussesRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    await this.bussesRepository.delete(id);
  }
  private async validateCreateBusRequest(request: CreateBusDto) {
    let bus: Bus;
    try {
      bus = await this.bussesRepository.findOne({
        where: [
          { licensePlate: request.licensePlate },
          { busDriver: request.busDriver },
        ],
      });
    } catch (err) {}

    if (bus) {
      if (
        bus.licensePlate === request.licensePlate &&
        bus.busDriver !== request.busDriver
      ) {
        throw new UnprocessableEntityException('License plate already exists.');
      } else if (
        bus.busDriver === request.busDriver &&
        bus.licensePlate !== request.licensePlate
      ) {
        throw new UnprocessableEntityException('Bus driver already exists.');
      } else {
        throw new UnprocessableEntityException(
          'License plate and Bus driver already exists.',
        );
      }
    }
  }
}
