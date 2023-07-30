import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {BussesService} from "./busses/busses.service";
import {CreateBusRequest} from "./busses/dto/create-bus.request";
import {JwtAuthGuard} from "@app/common";

@Controller('products')
export class ProductsController {

}
