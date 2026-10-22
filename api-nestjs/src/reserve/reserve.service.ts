import {
  Inject,
  Injectable,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { RESERVATION_QUEUE_CLIENT } from '../queue/queue.tokens';
import {
  RESERVATION_JOB,
  ReservationJobData,
} from '../queue/reservation-queue';
import { CreateReserveDto } from './dto/create-reserve.dto';

@Injectable()
export class ReserveService implements OnModuleDestroy {
  constructor(
    @Inject(RESERVATION_QUEUE_CLIENT)
    private readonly queue: Queue<ReservationJobData>,
  ) {}

  async onModuleDestroy() {
    await this.queue.close();
  }

  async createReservation(dto: CreateReserveDto) {
    const reservationId = randomUUID();

    try {
      await this.queue.add(
        RESERVATION_JOB,
        {
          ...dto,
          reservationId,
          submittedAt: new Date().toISOString(),
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      );
    } catch {
      throw new ServiceUnavailableException(
        'Reservations are temporarily unavailable. Please try again.',
      );
    }

    return { reservationId, status: 'accepted' };
  }
}
