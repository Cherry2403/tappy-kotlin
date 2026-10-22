import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Job, Worker } from 'bullmq';
import {
  RESERVATION_JOB,
  RESERVATION_QUEUE,
  ReservationJobData,
} from '../queue/reservation-queue';
import { createReservationConfirmationTemplate } from '../reserve/templates/reservation-confirmation.template';

@Injectable()
export class ReservationWorkerService implements OnModuleDestroy {
  private readonly logger = new Logger(ReservationWorkerService.name);
  private readonly worker: Worker<ReservationJobData>;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.worker = new Worker(
      RESERVATION_QUEUE,
      async (job) => this.process(job),
      {
        connection: {
          host: this.configService.getOrThrow<string>('REDIS_HOST'),
          port: this.configService.getOrThrow<number>('REDIS_PORT'),
          password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
        },
        concurrency: 1,
      },
    );
    this.worker.on('completed', (job) => {
      this.logger.log(`Reservation email job completed: ${job.id}`);
    });
    this.worker.on('failed', (job, error) => {
      this.logger.error(
        `Reservation email job failed: ${job?.id ?? 'unknown'}: ${error.message}`,
      );
    });
  }

  async onModuleDestroy() {
    await this.worker.close();
  }

  private async process(job: Job<ReservationJobData>) {
    if (job.name !== RESERVATION_JOB) {
      throw new Error(`Unsupported job: ${job.name}`);
    }

    const replyToEmail = this.configService.getOrThrow<string>('NOTIFY_EMAIL');
    const siteUrl = this.configService.getOrThrow<string>('PUBLIC_SITE_URL');

    await this.mailerService.sendMail({
      to: replyToEmail,
      replyTo: job.data.email,
      subject: '[Tappy] New reservation request',
      text: `Reservation ID: ${job.data.reservationId}\nSubmitted: ${job.data.submittedAt}\nName: ${job.data.name}\nEmail: ${job.data.email}\nNote: ${job.data.note || '-'}\nConsent to Terms & Privacy Policy: yes`,
    });

    const confirmation = createReservationConfirmationTemplate({
      name: job.data.name,
      siteUrl,
      replyToEmail,
    });

    await this.mailerService.sendMail({
      to: job.data.email,
      replyTo: replyToEmail,
      subject: 'Your Tappy reservation is received',
      html: confirmation.html,
      text: confirmation.text,
    });
  }
}
