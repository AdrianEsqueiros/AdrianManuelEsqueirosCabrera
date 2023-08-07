import {
    Body,
    Controller,
    Get,
    Inject,
    Post, Put,
    Query,
    UseGuards
} from '@nestjs/common';
import {AuthGuard, Role} from "@app/common";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {sendMicroserviceMessage} from "@app/common";
import {CreateItineraryDto} from "../../../products/src/itinerary/dto/create-itinerary.dto";
import {ClientProxy, Payload} from "@nestjs/microservices";
import {Roles} from "../../../auth/src/decorators/roles.decorator";
import {RolesGuard} from "../../../auth/src/guards/roles.guard";
import {SearchItinerariesRequest} from "../../../products/src/itinerary/dto/search-itineraries.request";
import {UpdateItineraryDto} from "../../../products/src/itinerary/dto/update-itinerary.dto";
@ApiTags('Itineraries')
@Controller('itineraries')
export class ItinerariesController {
    constructor(
        @Inject('ITINERARIES_SERVICE') private itinerariesService: ClientProxy,
    ) {}
    @Get()
    @ApiOperation({
        summary: 'Find itineraries',
        description:
            'Find all itineraries.',
    })
    getItineraries() {
        return sendMicroserviceMessage(
            this.itinerariesService,
            'get_itineraries',
            {}
        );
    }
    @Post('/create')
    @ApiOperation({
        summary: 'Create a new itinerary',
        description:
            'Create a new itinerary.',
    })
    @ApiBearerAuth()
    @Roles(Role.ONROAD)
    @UseGuards(AuthGuard,RolesGuard)
    async create(@Body() request: CreateItineraryDto) {
        return sendMicroserviceMessage(
            this.itinerariesService,
            'create_itinerary',
            request
        );
    }
    @Get('/search')
    @ApiOperation({
        summary: 'Get my reservations',
        description:
            'Search itineraries.',
    })
    searchItineraries(
        @Query() searchDto: SearchItinerariesRequest,)
    {
        return sendMicroserviceMessage(
            this.itinerariesService,
            'search_itineraries',
            searchDto
        );
    }
    @Put('/update')
    @ApiOperation({
        summary: 'Update a itinerary',
        description:
            'Update a itinerary. Only authenticated users with ONROAD role can access.',
    })
    @Roles(Role.ONROAD)
    @UseGuards(AuthGuard,RolesGuard)
    @ApiBearerAuth()
    updateItinerary(
        @Body() updateDto: UpdateItineraryDto,)
    {
        return sendMicroserviceMessage(
            this.itinerariesService,
            'update_itineraries',
            updateDto
        );
    }


}
