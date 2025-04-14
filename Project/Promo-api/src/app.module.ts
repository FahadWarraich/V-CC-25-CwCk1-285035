import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { PromoCode } from './promo-codes/entities/promo-code.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { VouchersModule } from './vouchers/vouchers.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PromoCodesService } from './promo-codes/promo-codes.service';
import { VouchersService } from './vouchers/vouchers.service';
import { Voucher } from './vouchers/entities/voucher.entity';
@Module({
  imports: [
    // AuthModule,
    UsersModule,
    PromoCodesModule,
    VouchersModule,

    TypeOrmModule.forRootAsync({
      imports: [UsersModule, VouchersModule],
      inject: [UsersService, VouchersService],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'fahad',
        password: process.env.DATABASE_PASSWORD || 'fahad1234',
        database: process.env.DATABASE_NAME || 'nestjs',
        entities: [PromoCode, User, Voucher],
        synchronize: true, // Set to false in production
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
