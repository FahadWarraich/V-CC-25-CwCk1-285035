import {
  Injectable,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PromoCodesService } from '../promo-codes/promo-codes.service';
import { VouchersService } from '../vouchers/vouchers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private promoCodesService: PromoCodesService,

    @Inject(forwardRef(() => VouchersService))
    private vouchersService: VouchersService,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate and mark the promo code as used
    const { valid, message } = await this.promoCodesService.validatePromoCode(
      createUserDto.promoCode,
    );

    if (!valid) {
      throw new ConflictException(message);
    }

    await this.promoCodesService.markAsUsed(createUserDto.promoCode);

    // Create new user
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.contactNumber = createUserDto.contactNumber;
    user.promoCode = await this.promoCodesService.findOne(
      createUserDto.promoCode,
    );

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate vouchers for user
    await this.vouchersService.generateVouchersForUser(savedUser);
    return savedUser;
  }

  async findAll() {
    return this.userRepository.find({
      relations: ['promoCode', 'vouchers'],
    });
  }
}
