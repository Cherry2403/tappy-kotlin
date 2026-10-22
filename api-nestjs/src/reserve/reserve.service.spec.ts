import { Queue } from 'bullmq';
import { ReservationJobData } from '../queue/reservation-queue';
import { ReserveService } from './reserve.service';

describe('ReserveService', () => {
  const queue = {
    add: jest.fn(),
    close: jest.fn(),
  };
  const service = new ReserveService(
    queue as unknown as Queue<ReservationJobData>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queue.add.mockResolvedValue(undefined);
  });

  it('enqueues reservation emails without waiting for SMTP', async () => {
    const result = await service.createReservation({
      name: 'Tappy Guest',
      email: 'guest@example.com',
      note: 'Please contact me soon.',
      consent: true,
    });

    expect(result.status).toBe('accepted');
    expect(result.reservationId).toHaveLength(36);
    expect(queue.add).toHaveBeenCalledTimes(1);

    const [jobName, jobData, jobOptions] = queue.add.mock.calls[0] as [
      string,
      ReservationJobData,
      { attempts: number; backoff: { type: string; delay: number } },
    ];

    expect(jobName).toBe('send-reservation-emails');
    expect(jobData).toMatchObject({
      reservationId: result.reservationId,
      name: 'Tappy Guest',
      email: 'guest@example.com',
      note: 'Please contact me soon.',
      consent: true,
    });
    expect(jobData.submittedAt).not.toBe('');
    expect(jobOptions).toMatchObject({
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  });

  it('closes queue during shutdown', async () => {
    await service.onModuleDestroy();

    expect(queue.close).toHaveBeenCalledTimes(1);
  });
});
