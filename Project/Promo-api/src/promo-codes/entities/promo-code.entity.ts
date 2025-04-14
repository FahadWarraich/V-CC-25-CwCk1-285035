import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryColumn()
  code: string;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  @OneToOne(() => User, (user) => user.promoCode, { nullable: true })
  user: User;
}
