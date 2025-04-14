import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VouchersService } from '../vouchers/vouchers.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly vouchersService: VouchersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with promo code' })
  @ApiResponse({
    status: 201,
    description: 'User registered and vouchers created successfully',
  })
  async register(@Body() userData: CreateUserDto) {
    console.log(userData);
    const user = await this.usersService.createUser(userData);
    const vouchers = await this.vouchersService.findByUser(user.id);

    console.log(vouchers);

    return {
      message: 'Registration successful',
      user: {
        name: user.name,
        email: user.email,
      },
      voucher: vouchers[0],
    };
  }

  @Get()
  // @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }
}
