import { DataSource } from 'typeorm';
import { QueryPresetEntity } from '../entities/query-preset.entity';

/**
 * 🌱 Seeder for Query Panel Presets
 *
 * These presets are OPTIONAL and serve as ready-to-use examples
 * to help the user understand how to use the QueryPanel.
 */
export const seedQueryPresets = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Query Presets seeding...');

  await dataSource.transaction(async (manager) => {
    const presetRepo = manager.getRepository(QueryPresetEntity);

    const presets = [
      {
        name: 'Hazmat – Declined Cases',
        userId: '00000000-0000-0000-0000-000000000001',
        filters: [{ field: 'is_hazmat', operator: '=', value: 'true' }],
      },
      {
        name: 'High Radius – Possible Declines',
        userId: '00000000-0000-0000-0000-000000000001',
        filters: [{ field: 'radius', operator: '>', value: '500' }],
      },
      {
        name: 'New Ventures – REFER Required',
        userId: '00000000-0000-0000-0000-000000000001',
        filters: [{ field: 'years_in_business', operator: '<', value: '1' }],
      },
      {
        name: 'Driver Eligibility – Under 23',
        userId: '00000000-0000-0000-0000-000000000001',
        filters: [{ field: 'driver_age', operator: '<', value: '23' }],
      },
      {
        name: 'High-Risk Cargo (Oversized / Special Handling)',
        userId: '00000000-0000-0000-0000-000000000001',
        filters: [
          {
            field: 'commodity_type',
            operator: 'IN',
            value: 'Oversized,Heavy Equipment,Logging',
          },
        ],
      },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const p of presets) {
      const exists = await presetRepo.findOne({
        where: { name: p.name },
      });

      if (!exists) {
        await presetRepo.save(
          presetRepo.create({
            name: p.name,
            userId: p.userId,
            filtersJson: JSON.stringify(p.filters),
          }),
        );
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Query Presets seeding completed: ${inserted} inserted, ${skipped} skipped.`);
  });
};
