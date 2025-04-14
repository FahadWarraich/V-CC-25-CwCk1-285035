import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PromoCode } from '../../promo-codes/entities/promo-code.entity';
import { Voucher } from 'src/vouchers/entities/voucher.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  contactNumber: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registeredAt: Date;

  @OneToOne(() => PromoCode, (promoCode) => promoCode.user, { eager: true })
  @JoinColumn()
  promoCode: PromoCode;

  @OneToOne(() => Voucher, (voucher) => voucher.user)
  voucher: Voucher;
}
