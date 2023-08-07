import {Body, Controller, Get, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard, Role} from "@app/common";
import {ClientProxy} from "@nestjs/microservices";
import {sendMicroserviceMessage} from "@app/common";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CreateBusDto} from "../../../products/src/busses/dto/create-bus.dto";
import {Roles} from "../../../auth/src/decorators/roles.decorator";
import {RolesGuard} from "../../../auth/src/guards/roles.guard";
@ApiTags('Busses')
@Controller('busses')
export class BussesController {
    constructor(
        @Inject('BUS_SERVICE') private bussesService: ClientProxy,
    ) {}

    @Post('/create')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create a new bus',
        description:
            'Create a new bus. Only authenticated users with ONROAD role can access',
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.ONROAD)
    async create(@Body() request: CreateBusDto) {
        return sendMicroserviceMessage(
            this.bussesService,
            'create_buses',
            request,
        );
    }
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get my reservations',
        description:
            'Find Busses. Only authenticated users with ONROAD role can access.',
    })
    @Roles(Role.ONROAD)
    @UseGuards(AuthGuard,RolesGuard)
    getBuses() {
        return sendMicroserviceMessage(
            this.bussesService,
            'get_busses',
            {}
        );
    }

}
