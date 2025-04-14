import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  // UseGuards,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodeValidationResponseDto } from './dto/promo-code-validation-response-dto';
import { SeedPromoCodesDto } from './dto/seed-promo-code.dto';
// import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get(':code/validate')
  @ApiOperation({ summary: 'Validate a promotional code' })
  @ApiParam({
    name: 'code',
    description: 'Promotional code to validate',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns validation result',
    type: PromoCodeValidationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Promo code not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  async validate(
    @Param('code') code: string,
  ): Promise<PromoCodeValidationResponseDto> {
    try {
      const result = await this.promoCodesService.validatePromoCode(code);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to validate promo code');
    }
  }

  @Post('seed')
  // @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed promotional codes (Admin only)' })
  @ApiBody({
    type: SeedPromoCodesDto,
    description: 'List of promo codes to seed',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Promo codes seeded successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authorized',
  })
  async seed(@Body(new ValidationPipe()) seedDto: SeedPromoCodesDto) {
    try {
      // Input validation
      if (!seedDto.codes || seedDto.codes.length === 0) {
        throw new BadRequestException('No promotional codes provided');
      }

      // Normalize codes to uppercase and trim whitespace
      const normalizedCodes = seedDto.codes.map((code) =>
        code.trim().toUpperCase(),
      );

      // Remove duplicates
      const uniqueCodes = [...new Set(normalizedCodes)];

      // Remove empty codes
      const validCodes = uniqueCodes.filter((code) => code.length > 0);

      // Check if we have any valid codes after filtering
      if (validCodes.length === 0) {
        throw new BadRequestException(
          'No valid promotional codes provided after normalization',
        );
      }

      // Log the seeding operation (with limited code visibility for security)
      const displayCodes =
        validCodes.length > 3
          ? `${validCodes.slice(0, 3).join(', ')}... and ${validCodes.length - 3} more`
          : validCodes.join(', ');

      console.log(
        `Admin seeding ${validCodes.length} promo codes: ${displayCodes}`,
      );

      // Perform the seeding operation
      const result = await this.promoCodesService.seedPromoCodes(validCodes);

      // Return success response with details
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Promotional codes seeded successfully',
        data: {
          totalSubmitted: seedDto.codes.length,
          uniqueCodesAfterNormalization: uniqueCodes.length,
          validCodesProcessed: validCodes.length,
          created: result.created,
          skipped: result.skipped,
          details: result.details,
        },
      };
    } catch (error) {
      // If it's already a NestJS HTTP exception, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise, wrap it in a BadRequestException
      throw new BadRequestException(
        `Failed to seed promo codes: ${error.message}`,
      );
    }
  }
}
