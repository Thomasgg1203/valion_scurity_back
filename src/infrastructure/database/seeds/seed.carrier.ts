import { DataSource } from 'typeorm';
import { CarrierEntity } from '../entities/carrier.entity';

/**
 * 🌱 Seeder for Carriers (Insurance Companies)
 * - Inserts base carrier partners
 */
export const seedCarriers = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Carriers seeding...');

  await dataSource.transaction(async (manager) => {
    const carriersToInsert = [
      { name: 'BERKLEY' },
      { name: 'SOUTHWIND' },
      { name: 'BULLDOG' },
      { name: 'STAR MUTUAL' },
      { name: 'CANOPIUS' },
      { name: 'CANAL TEST DRIVE' },
      { name: 'NATIONAL INDEMNITY COMPANY' },
      { name: 'NORTHLAND' },
      { name: 'OCCIDENTAL FIRE & CASUALTY' },
      { name: 'CANAL' },
      { name: 'ADMITTED PROGRAM' },
      { name: 'NON ADMITTED PROGRAM' },
      { name: 'MULTIPLE CARRIERS' },
      { name: 'GRANADA' },
      { name: 'KNIGHT SPECIALTY' },
      { name: 'AMERICAN INTERFIDELITY EXCHANGE' },
      { name: "LLOYD'S OF LONDON" },
      { name: 'TRAILBLAZER' },
      { name: 'FORTEGRA' },
      { name: 'ADRIATIC' },
      { name: 'UNIVERSAL CASUALTY RRG' },
      { name: 'GREAT LAKES' },
      { name: 'LLOYDS' },
      { name: 'UNITED NATIONAL' },
      { name: 'MOTOR TRANSPORT MUTUAL' },
      { name: 'AGRICULTURAL WORKERS MUTUAL AUTO INSURANCE COMPANY' },
      { name: 'DB INSURANCE (U.S. BRANCH)' },
      { name: 'NAFTA PROGRAM' },
      { name: 'OBSIDIAN SPECIALTY' },
      { name: 'PRIME INSURANCE COMPANY' },
      { name: 'PRIME PROPERTY & CASUALTY' },
      { name: 'PROFESSIONAL TRANSPORTATION RRG' },
      { name: "CERTAIN UNDERWRITERS AT LLOYD'S" },
      { name: 'CHUBB' },
      { name: 'GREAT AMERICAN' },
      { name: 'OLD REPUBLIC' },
      { name: 'PALOMAR' },
      { name: 'PMA' },
      { name: 'PROGRESSIVE' },
      { name: 'UNITED STATES FIRE INSURANCE COMPANY' },
      { name: 'AIG INSURANCE' },
      { name: 'ARCH' },
      { name: 'BERKLEY PRIME' },
      { name: 'CRUM & FORSTER' },
      { name: 'PAN AMERICAN LIFE INSURANCE COMPANY' },
      { name: 'ACCREDITED SPECIALTY INSURANCE' },
      { name: 'AMERICAN CONTRACTORS INDEMNITY COMPANY' },
      { name: 'ATRIUM' },
      { name: 'TRISURA' },
      { name: 'PROTECTIVE INSURANCE COMPANY' },
      { name: 'ALPINE TRANSPORTATION INSURANCE' },
      { name: 'ACCREDITED' },
      { name: 'EVERSPAN' },
      { name: 'COUNTY HALL' },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const carrier of carriersToInsert) {
      const exists = await manager.findOne(CarrierEntity, {
        where: { name: carrier.name },
      });

      if (!exists) {
        await manager.save(
          CarrierEntity,
          manager.create(CarrierEntity, {
            name: carrier.name,
            createdAt: new Date(),
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ Carriers seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
