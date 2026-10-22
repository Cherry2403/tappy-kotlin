import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { RESERVATION_QUEUE_CLIENT } from '../queue/queue.tokens';
import {
  RESERVATION_QUEUE,
  ReservationJobData,
} from '../queue/reservation-queue';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';

@Module({
  controllers: [ReserveController],
  providers: [
    ReserveService,
    {
      provide: RESERVATION_QUEUE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Queue<ReservationJobData>(RESERVATION_QUEUE, {
          connection: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          },
        }),
    },
  ],
})
export class ReserveModule {}
