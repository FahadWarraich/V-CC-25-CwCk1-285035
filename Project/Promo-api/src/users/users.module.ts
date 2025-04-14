import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PromoCodesModule } from '../promo-codes/promo-codes.module';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => VouchersModule),
    PromoCodesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
