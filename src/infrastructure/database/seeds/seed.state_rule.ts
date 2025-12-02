import { DataSource } from 'typeorm';
import { StateRuleEntity } from '../entities/state-rule.entity';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
import { StateEntity } from '../entities/state.entity';

/**
 * 🌱 Seeder for State-Based Underwriting Rules
 * - These apply specific restrictions based on state
 */
export const seedStateRules = async (dataSource: DataSource) => {
  console.log('⚙️ Starting State Rules seeding...');

  await dataSource.transaction(async (manager) => {
    const ruleRepo = manager.getRepository(StateRuleEntity);
    const fieldRepo = manager.getRepository(GuidelineFieldEntity);
    const stateRepo = manager.getRepository(StateEntity);
    const mcRepo = manager.getRepository(MgaCarrierEntity);

    const carriers = await mcRepo.find();
    const states = await stateRepo.find();
    const fields = await fieldRepo.find();

    // Create field map
    const getField = (name: string) => fields.find((f) => f.name === name);

    // ============================
    // RULES PER STATE (realistic)
    // ============================
    const rules = [
      // -----------------------------------
      // CALIFORNIA (CA)
      // -----------------------------------
      {
        state: 'CA',
        field: 'is_hazmat',
        operator: '=',
        value: 'true',
        comment: 'Hazmat not allowed in CA.',
      },
      {
        state: 'CA',
        field: 'radius',
        operator: '>',
        value: '300',
        comment: 'Radius over 300 is declined in CA.',
      },
      {
        state: 'CA',
        field: 'years_in_business',
        operator: '<',
        value: '1',
        comment: 'New ventures not allowed in CA.',
      },

      // -----------------------------------
      // FLORIDA (FL)
      // -----------------------------------
      {
        state: 'FL',
        field: 'years_experience',
        operator: '<',
        value: '2',
        comment: 'Drivers must have 2 years experience in FL.',
      },
      {
        state: 'FL',
        field: 'requested_liability_limit',
        operator: '>',
        value: '1000000',
        comment: 'Max liability limit in FL is $1M.',
      },

      // -----------------------------------
      // NEW YORK (NY)
      // -----------------------------------
      {
        state: 'NY',
        field: 'radius',
        operator: '>',
        value: '200',
        comment: 'Radius over 200 not accepted in NY.',
      },
      {
        state: 'NY',
        field: 'commodity_type',
        operator: '=',
        value: 'Oversized',
        comment: 'Oversized cargo forbidden in NY.',
      },

      // -----------------------------------
      // TEXAS (TX)
      // -----------------------------------
      {
        state: 'TX',
        field: 'is_hazmat',
        operator: '=',
        value: 'true',
        comment: 'Hazmat allowed but referred in TX.',
      },
      {
        state: 'TX',
        field: 'years_in_business',
        operator: '<',
        value: '0',
        comment: 'New ventures allowed in TX.',
      },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const mc of carriers) {
      for (const r of rules) {
        const state = states.find((s) => s.code === r.state);
        const field = getField(r.field);

        if (!state || !field) continue;

        const exists = await ruleRepo.findOne({
          where: {
            mgaCarrier: { id: mc.id },
            state: { id: state.id },
            field: { id: field.id },
            operator: r.operator,
            value: r.value,
          },
        });

        if (!exists) {
          await ruleRepo.save(
            ruleRepo.create({
              mgaCarrier: mc,
              state,
              field,
              operator: r.operator,
              value: r.value,
              comment: r.comment,
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

    console.log(`✅ State Rules seeding completed: ${inserted} inserted, ${skipped} skipped.`);
  });
};
