import { DataSource } from 'typeorm';
import { ExclusionEntity } from '../entities/exclusion.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';

/**
 * 🌱 OPTIONAL Seeder for MGA–Carrier Exclusions
 *
 * 🔥 IMPORTANT (READ THIS):
 * This seed is a PLUS added to the underwriting engine.
 * It was NOT part of the user’s original Excel.
 *
 * WHY DOES IT EXIST?
 * -------------------
 * - In real MGA/Carrier underwriting, carriers have “special exclusions”
 *   that are NOT logical rules (state or guideline rules).
 * - These are typically “manual notes” or “underwriter comments”.
 * - They enhance the decision engine and provide richer information.
 *
 * WHY IS IT OPTIONAL?
 * -------------------
 * - Your current system does NOT require exclusions to operate.
 * - If developers decide not to use exclusions, the system still works.
 * - If they DO use them in reports or ruling screens → it adds value.
 *
 * WHEN TO USE:
 * ------------
 * - To show warnings or special restrictions in the QueryPanel.
 * - To justify rejections that are not pure logical rules.
 *
 */
export const seedExclusions = async (dataSource: DataSource) => {
  console.log('⚙️ Starting OPTIONAL Exclusions seeding...');

  await dataSource.transaction(async (manager) => {
    const mcRepo = manager.getRepository(MgaCarrierEntity);
    const exclusionRepo = manager.getRepository(ExclusionEntity);

    const carriers = await mcRepo.find();
    if (!carriers.length) {
      console.warn('⚠️ No MGA–Carrier relationships found. Skipping.');
      return;
    }

    // ===============================
    // STANDARD MARKET EXCLUSION NOTES
    // ===============================
    const exclusionsList = [
      'No Reefer Claims Accepted',
      'Oversized Loads Not Eligible',
      'Salvage Units Excluded',
      'Hazmat New Ventures Not Accepted',
      'Drivers Under 25 Excluded',
    ];

    let inserted = 0;
    let skipped = 0;

    for (const mc of carriers) {
      for (const reason of exclusionsList) {
        const exists = await exclusionRepo.findOne({
          where: {
            mgaCarrier: { id: mc.id },
            reason,
          },
        });

        if (!exists) {
          await exclusionRepo.save(
            exclusionRepo.create({
              mgaCarrier: mc,
              reason,
              createdAt: new Date(),
            }),
          );
          inserted++;
        } else {
          skipped++;
        }
      }
    }

    console.log(
      `✅ OPTIONAL Exclusions seeding completed: ${inserted} inserted, ${skipped} skipped.`,
    );
  });
};
