import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ReserveService } from './reserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body() dto: CreateReserveDto) {
    return this.reserveService.createReservation(dto);
  }
}
