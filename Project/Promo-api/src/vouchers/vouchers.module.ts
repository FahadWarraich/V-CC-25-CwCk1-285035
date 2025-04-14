import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { UsersModule } from 'src/users/users.module';
import { PromoCodesModule } from 'src/promo-codes/promo-codes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]), forwardRef(() => UsersModule)],
  providers: [VouchersService],
  controllers: [VouchersController],
  exports: [VouchersService],
})
export class VouchersModule {}
