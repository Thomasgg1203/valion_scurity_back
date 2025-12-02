import { DataSource } from 'typeorm';
import { GuidelineRuleEntity } from '../entities/guideline-rule.entity';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';

/**
 * 🌱 Seeder for Guideline Rules
 * - Basic underwriting rules (based on real Excel logic)
 * - Applies to ALL MGA–Carrier combos
 */
export const seedGuidelineRules = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Guideline Rules seeding...');

  await dataSource.transaction(async (manager) => {
    const ruleRepo = manager.getRepository(GuidelineRuleEntity);
    const fieldRepo = manager.getRepository(GuidelineFieldEntity);
    const mgaCarrierRepo = manager.getRepository(MgaCarrierEntity);

    // Load fields
    const fields = await fieldRepo.find({ relations: ['category'] });
    const fieldMap = new Map<string, GuidelineFieldEntity>();
    fields.forEach((f) => fieldMap.set(f.name, f));

    // Load MGA–Carrier combos
    const carriers = await mgaCarrierRepo.find();
    if (!carriers.length) {
      console.warn('⚠️ No MGA–Carrier combinations found.');
      return;
    }

    // Validate required fields exist
    const requiredFields = [
      'vehicle_year',
      'driver_age',
      'years_experience',
      'radius',
      'commodity_type',
      'is_hazmat',
      'years_in_business',
      'requested_liability_limit',
    ];

    for (const f of requiredFields) {
      if (!fieldMap.has(f)) {
        console.warn(`⚠️ Missing guideline field: ${f}`);
        return;
      }
    }

    // =====================================
    // BASE RULESET (LIKE THE REAL EXCEL)
    // =====================================
    const rulesBase = [
      // VEHICLE
      {
        field: 'vehicle_year',
        operator: '<',
        value: '2000',
        comment: 'Vehicles older than 2000 are declined.',
      },
      // DRIVER
      {
        field: 'driver_age',
        operator: '<',
        value: '23',
        comment: 'Drivers under 23 are declined.',
      },
      {
        field: 'years_experience',
        operator: '<',
        value: '2',
        comment: 'Less than 2 years experience = REFER.',
      },
      // OPERATIONS
      {
        field: 'radius',
        operator: '>',
        value: '500',
        comment: 'Radius over 500 miles is declined.',
      },
      {
        field: 'years_in_business',
        operator: '<',
        value: '1',
        comment: 'New venture = REFER.',
      },
      // COMMODITY
      {
        field: 'is_hazmat',
        operator: '=',
        value: 'true',
        comment: 'Hazmat loads not accepted.',
      },
      // COVERAGES
      {
        field: 'requested_liability_limit',
        operator: '>',
        value: '1000000',
        comment: 'Limit above $1M is declined.',
      },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const mc of carriers) {
      for (const baseRule of rulesBase) {
        const fieldEntity = fieldMap.get(baseRule.field);
        if (!fieldEntity) continue;

        // does rule exist?
        const exists = await ruleRepo.findOne({
          where: {
            mgaCarrier: { id: mc.id },
            field: { id: fieldEntity.id },
            operator: baseRule.operator,
            value: baseRule.value,
          },
        });

        if (!exists) {
          await ruleRepo.save(
            ruleRepo.create({
              mgaCarrier: mc,
              field: fieldEntity,
              operator: baseRule.operator,
              value: baseRule.value,
              comment: baseRule.comment,
              version: 1,
              is_current: true,
              createdBy: 'system-seed',
            }),
          );

          inserted++;
        } else {
          skipped++;
        }
      }
    }

    console.log(`✅ Guideline Rules seeding completed: ${inserted} inserted, ${skipped} skipped.`);
  });
};
