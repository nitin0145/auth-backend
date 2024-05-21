import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import * as winston from 'winston';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest_auth_app'),
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
      ],
    }),
  ],
})
export class AppModule {}
