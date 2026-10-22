import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { loadEnvironment } from '../config/environment';
import { ReservationWorkerService } from './reservation-worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: loadEnvironment }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 15_000,
          auth: {
            user: configService.getOrThrow<string>('GMAIL'),
            pass: configService.getOrThrow<string>('GMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"VuurKat" <${configService.getOrThrow<string>('GMAIL')}>`,
        },
      }),
    }),
  ],
  providers: [ReservationWorkerService],
})
export class WorkerModule {}
