import { DataSource } from 'typeorm';
import { LimitUnitEntity } from '../entities/limit-unit.entity';

/**
 * 🌱 Seeder for Limit Units
 * - Inserts standard limit/deductible units used across underwriting products
 */
export const seedLimitUnits = async (dataSource: DataSource) => {
  console.log('⚙️ Starting LimitUnit seeding...');

  await dataSource.transaction(async (manager) => {
    const unitRepo = manager.getRepository(LimitUnitEntity);

    // ===============================
    // UNITS USED IN LIMITS & DEDUCTIBLES
    // ===============================
    const limitUnitsData = [
      {
        code: 'USD',
        name: 'US Dollars',
      },
      {
        code: 'PCT',
        name: 'Percentage',
      },
      {
        code: 'AGG',
        name: 'Aggregate Limit',
      },
      {
        code: 'OCC',
        name: 'Per Occurrence',
      },
      {
        code: 'PER_UNIT',
        name: 'Per Unit / Per Vehicle',
      },
      {
        code: 'PER_LOAD',
        name: 'Per Load (Cargo)',
      },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const unit of limitUnitsData) {
      // Check if unit already exists
      const exists = await unitRepo.findOne({ where: { code: unit.code } });

      if (!exists) {
        await manager.save(
          LimitUnitEntity,
          manager.create(LimitUnitEntity, {
            code: unit.code,
            name: unit.name,
            createdAt: new Date(),
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ LimitUnit seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
