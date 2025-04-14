import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher, VoucherType } from './entities/voucher.entity';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async findByUser(userId: string): Promise<Voucher[]> {
    return this.vouchersRepository.find({
      where: { user: { id: userId } },
    });
  }

  async generateVouchersForUser(user: User): Promise<Voucher[]> {
    const vouchers: Voucher[] = [];

    // Every user gets a discount voucher
    const discountVoucher = new Voucher();
    discountVoucher.code = `DISC-${uuidv4().substring(0, 8).toUpperCase()}`;
    discountVoucher.type = VoucherType.DISCOUNT;
    discountVoucher.user = user;
    vouchers.push(discountVoucher);

    // 1 in 100 users get a free session voucher
    if (Math.random() <= 0.01) {
      const freeSessionVoucher = new Voucher();
      freeSessionVoucher.code = `FREE-${uuidv4().substring(0, 8).toUpperCase()}`;
      freeSessionVoucher.type = VoucherType.FREE_SESSION;
      freeSessionVoucher.user = user;
      vouchers.push(freeSessionVoucher);
    }

    return this.vouchersRepository.save(vouchers);
  }

  async validateVoucher(code: string): Promise<Voucher> {
    const voucher = await this.vouchersRepository.findOne({
      where: { code },
      relations: ['user'],
    });

    if (!voucher) {
      throw new Error(`Voucher with code ${code} not found`);
    }

    return voucher;
  }
}
