import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { PromoCodeValidationResponseDto } from './dto/promo-code-validation-response-dto';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodesRepository: Repository<PromoCode>,
  ) {}

  async findOne(code: string): Promise<PromoCode> {
    const promoCode = await this.promoCodesRepository.findOne({
      where: { code },
    });
    if (!promoCode) {
      throw new NotFoundException(`Promotional code ${code} not found`);
    }
    return promoCode;
  }

  async validatePromoCode(
    code: string,
  ): Promise<PromoCodeValidationResponseDto> {
    try {
      // Validate input
      if (!code || code.trim() === '') {
        return {
          valid: false,
          message: 'Promotional code cannot be empty',
        };
      }

      // Normalize code
      const normalizedCode = code.trim().toUpperCase();

      // Find the promo code
      const promoCode = await this.findOne(normalizedCode).catch(() => null);

      // Check if promo code exists
      if (!promoCode) {
        throw new NotFoundException(
          `Promotional code ${normalizedCode} not found`,
        );
      }

      // Check if promo code has been used
      if (promoCode.used) {
        return {
          valid: false,
          message: `Promotional code ${normalizedCode} has already been used`,
        };
      }

      // Return successful validation result
      return {
        valid: true,

        message: 'Promotional code is valid',
      };
    } catch (error) {
      // Rethrow NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Handle other errors
      throw new BadRequestException(
        `Error validating promotional code: ${error.message}`,
      );
    }
  }
  async markAsUsed(code: string): Promise<PromoCode> {
    const promoCode = await this.findOne(code);

    promoCode.used = true;
    promoCode.usedAt = new Date();

    return this.promoCodesRepository.save(promoCode);
  }

  /**
   * Seeds promotional codes into the database
   * @param codes Array of promo code strings to create
   * @returns Summary of the seeding operation
   */
  async seedPromoCodes(codes: string[]): Promise<{
    totalProcessed: number;
    created: number;
    skipped: number;
    details?: string;
  }> {
    try {
      if (!codes || codes.length === 0) {
        throw new BadRequestException('No promotional codes provided');
      }

      // Track statistics
      let created = 0;
      let skipped = 0;
      const skippedCodes: string[] = [];

      // Process codes in batches to avoid memory issues with large arrays
      const batchSize = 100;
      const results: PromoCode[] = [];

      for (let i = 0; i < codes.length; i += batchSize) {
        const batch = codes.slice(i, i + batchSize);

        // Check for existing codes
        const existingCodes = await this.promoCodesRepository.find({
          where: { code: In(batch) },
        });

        const existingCodesSet = new Set(
          existingCodes.map((promo) => promo.code),
        );

        // Create new promo code entities
        const newPromoCodes = batch
          .filter((code) => !existingCodesSet.has(code))
          .map((code) => {
            const promoCode = new PromoCode();
            promoCode.code = code;
            promoCode.used = false;
            promoCode.createdAt = new Date();
            return promoCode;
          });

        // Update statistics
        created += newPromoCodes.length;
        skipped += batch.length - newPromoCodes.length;

        // Add skipped codes to the list
        batch
          .filter((code) => existingCodesSet.has(code))
          .forEach((code) => skippedCodes.push(code));

        // Save batch
        if (newPromoCodes.length > 0) {
          const savedCodes =
            await this.promoCodesRepository.save(newPromoCodes);
          results.push(...savedCodes);
        }

        // Allow other operations to process between batches
        if (i + batchSize < codes.length) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      // Generate detailed report
      let details: string = '';
      if (skippedCodes.length > 0) {
        details = `Skipped ${skippedCodes.length} existing codes: ${
          skippedCodes.length > 10
            ? `${skippedCodes.slice(0, 10).join(', ')}... and ${skippedCodes.length - 10} more`
            : skippedCodes.join(', ')
        }`;
      }

      return {
        totalProcessed: codes.length,
        created,
        skipped,
        details: details,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to seed promo codes: ${error.message}`,
      );
    }
  }
}
