import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
export enum VoucherType {
  DISCOUNT = 'DISCOUNT',
  FREE_SESSION = 'FREE_SESSION',
}

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: VoucherType,
  })
  type: VoucherType;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  @OneToOne(() => User, (user) => user.voucher)
  @JoinColumn()
  user: User;
}
