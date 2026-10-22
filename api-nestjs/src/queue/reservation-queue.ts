import { CreateReserveDto } from '../reserve/dto/create-reserve.dto';

export const RESERVATION_QUEUE = 'reservation-emails';
export const RESERVATION_JOB = 'send-reservation-emails';

export type ReservationJobData = CreateReserveDto & {
  reservationId: string;
  submittedAt: string;
};
