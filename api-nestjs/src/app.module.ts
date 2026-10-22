import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { loadEnvironment } from './config/environment';
import { ReserveModule } from './reserve/reserve.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: loadEnvironment }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    ReserveModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
