import { DataSource } from 'typeorm';
import { MgaEntity } from '../entities/mga.entity';

/**
 * 🌱 Seeder for MGAs (Managing General Agents)
 * - Inserts base MGA partners
 */
export const seedMGAs = async (dataSource: DataSource) => {
  console.log('⚙️ Starting MGAs seeding...');

  await dataSource.transaction(async (manager) => {
    const mgasToInsert = [
      { name: 'DYNAMIC' },
      { name: 'MAXIMUM' },
      { name: 'COVER BADGER' },
      { name: 'GIC' },
      { name: 'GUARDIAN' },
      { name: 'GSIAY' },
      { name: 'INTER INSURANCE' },
      { name: 'ISC' },
      { name: 'IRIS' },
      { name: 'MTM' },
      { name: 'PARAMOUNT' },
      { name: 'PRIME' },
      { name: 'PROFESSIONAL' },
      { name: 'ROCKLAKE' },
      { name: 'RPS' },
      { name: 'SIU' },
      { name: 'STAR MUTUAL' },
      { name: 'TIP NATIONAL' },
      { name: 'TREATY AOK' },
      { name: 'COVER WHALE' },
      { name: 'COUNTY HALL' },
      { name: 'NOVATAE' },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const mga of mgasToInsert) {
      const exists = await manager.findOne(MgaEntity, {
        where: { name: mga.name },
      });

      if (!exists) {
        await manager.save(
          MgaEntity,
          manager.create(MgaEntity, {
            name: mga.name,
            createdAt: new Date(),
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ MGAs seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`);
  });
};
