import {
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VouchersService } from './vouchers.service';
// import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';
@ApiTags('vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get(':code/validate')
  @ApiOperation({ summary: 'Validate a voucher code' })
  async validate(@Param('code') code: string) {
    const voucher = await this.vouchersService.validateVoucher(code);
    return {
      valid: !!voucher && !voucher.used,
      type: voucher?.type,
    };
  }

  @Get('user/:userId')
  // @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vouchers by user ID (Admin only)' })
  async findByUser(@Param('userId') userId: string) {
    return this.vouchersService.findByUser(userId);
  }
}
