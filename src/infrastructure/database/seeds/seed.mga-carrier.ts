import { DataSource } from 'typeorm';
import { MgaCarrier } from '../../../modules/partners/entities/mga-carrier.entity';
import { Mga } from '../../../modules/partners/entities/mga.entity';
import { Carrier } from '../../../modules/partners/entities/carrier.entity';

/**
 * 🌱 Seeder for MGA-Carrier relationships
 * - Links MGAs with their corresponding Carriers
 */
export const seedMgaCarriers = async (dataSource: DataSource) => {
  console.log('⚙️ Starting MGA-Carrier relationships seeding...');

  await dataSource.transaction(async (manager) => {
    const relationshipsToInsert = [
      { mga: 'DYNAMIC', carrier: 'BERKLEY' },
      { mga: 'DYNAMIC', carrier: 'SOUTHWIND' },
      { mga: 'DYNAMIC', carrier: 'BULLDOG' },
      { mga: 'DYNAMIC', carrier: 'STAR MUTUAL' },
      { mga: 'DYNAMIC', carrier: 'CANOPIUS' },
      { mga: 'MAXIMUM', carrier: 'CANAL TEST DRIVE' },
      { mga: 'MAXIMUM', carrier: 'NATIONAL INDEMNITY COMPANY' },
      { mga: 'MAXIMUM', carrier: 'NORTHLAND' },
      { mga: 'MAXIMUM', carrier: 'OCCIDENTAL FIRE & CASUALTY' },
      { mga: 'MAXIMUM', carrier: 'BERKLEY' },
      { mga: 'MAXIMUM', carrier: 'CANAL' },
      { mga: 'COVER BADGER', carrier: 'ADMITTED PROGRAM' },
      { mga: 'COVER BADGER', carrier: 'NON ADMITTED PROGRAM' },
      { mga: 'COVER BADGER', carrier: 'MULTIPLE CARRIERS' },
      { mga: 'GIC', carrier: 'GRANADA' },
      { mga: 'GIC', carrier: 'KNIGHT SPECIALTY' },
      { mga: 'GIC', carrier: 'MULTIPLE CARRIERS' },
      { mga: 'GUARDIAN', carrier: 'AMERICAN INTERFIDELITY EXCHANGE' },
      { mga: 'GUARDIAN', carrier: "LLOYD'S OF LONDON" },
      { mga: 'GSIAY', carrier: 'TRAILBLAZER' },
      { mga: 'GSIAY', carrier: 'FORTEGRA' },
      { mga: 'GSIAY', carrier: 'ADRIATIC' },
      { mga: 'INTER INSURANCE', carrier: "LLOYD'S OF LONDON" },
      { mga: 'INTER INSURANCE', carrier: 'UNIVERSAL CASUALTY RRG' },
      { mga: 'ISC', carrier: 'MULTIPLE CARRIERS' },
      { mga: 'IRIS', carrier: 'GREAT LAKES' },
      { mga: 'IRIS', carrier: 'LLOYDS' },
      { mga: 'IRIS', carrier: 'UNITED NATIONAL' },
      { mga: 'MTM', carrier: 'MOTOR TRANSPORT MUTUAL' },
      { mga: 'PARAMOUNT', carrier: 'AGRICULTURAL WORKERS MUTUAL AUTO INSURANCE COMPANY' },
      { mga: 'PARAMOUNT', carrier: 'DB INSURANCE (U.S. BRANCH)' },
      { mga: 'PARAMOUNT', carrier: "LLOYD'S OF LONDON" },
      { mga: 'PARAMOUNT', carrier: 'NAFTA PROGRAM' },
      { mga: 'PARAMOUNT', carrier: 'OBSIDIAN SPECIALTY' },
      { mga: 'PRIME', carrier: 'PRIME INSURANCE COMPANY' },
      { mga: 'PRIME', carrier: 'PRIME PROPERTY & CASUALTY' },
      { mga: 'PROFESSIONAL', carrier: 'PROFESSIONAL TRANSPORTATION RRG' },
      { mga: 'ROCKLAKE', carrier: 'AMERICAN INTERFIDELITY EXCHANGE' },
      { mga: 'ROCKLAKE', carrier: 'CANAL' },
      { mga: 'ROCKLAKE', carrier: 'CANAL TEST DRIVE' },
      { mga: 'ROCKLAKE', carrier: 'CANOPIUS' },
      { mga: 'ROCKLAKE', carrier: "CERTAIN UNDERWRITERS AT LLOYD'S" },
      { mga: 'ROCKLAKE', carrier: 'CHUBB' },
      { mga: 'ROCKLAKE', carrier: 'GREAT AMERICAN' },
      { mga: 'ROCKLAKE', carrier: 'GREAT LAKES' },
      { mga: 'ROCKLAKE', carrier: 'OLD REPUBLIC' },
      { mga: 'ROCKLAKE', carrier: 'PALOMAR' },
      { mga: 'ROCKLAKE', carrier: 'PMA' },
      { mga: 'ROCKLAKE', carrier: 'PROGRESSIVE' },
      { mga: 'ROCKLAKE', carrier: 'UNITED STATES FIRE INSURANCE COMPANY' },
      { mga: 'RPS', carrier: 'AIG INSURANCE' },
      { mga: 'RPS', carrier: 'ARCH' },
      { mga: 'RPS', carrier: 'BERKLEY PRIME' },
      { mga: 'RPS', carrier: 'CANAL' },
      { mga: 'RPS', carrier: 'CRUM & FORSTER' },
      { mga: 'RPS', carrier: 'GREAT AMERICAN' },
      { mga: 'RPS', carrier: 'NATIONAL INDEMNITY COMPANY' },
      { mga: 'RPS', carrier: 'NORTHLAND' },
      { mga: 'RPS', carrier: 'OCCIDENTAL FIRE & CASUALTY' },
      { mga: 'RPS', carrier: 'PAN AMERICAN LIFE INSURANCE COMPANY' },
      { mga: 'SIU', carrier: 'BERKLEY' },
      { mga: 'SIU', carrier: 'NATIONAL INDEMNITY COMPANY' },
      { mga: 'STAR MUTUAL', carrier: 'STAR MUTUAL' },
      { mga: 'TIP NATIONAL', carrier: 'ACCREDITED SPECIALTY INSURANCE' },
      { mga: 'TIP NATIONAL', carrier: 'AMERICAN CONTRACTORS INDEMNITY COMPANY' },
      { mga: 'TIP NATIONAL', carrier: 'ATRIUM' },
      { mga: 'TIP NATIONAL', carrier: "LLOYD'S OF LONDON" },
      { mga: 'TIP NATIONAL', carrier: 'TRISURA' },
      { mga: 'TIP NATIONAL', carrier: 'PROTECTIVE INSURANCE COMPANY' },
      { mga: 'TREATY AOK', carrier: 'ALPINE TRANSPORTATION INSURANCE' },
      { mga: 'COVER WHALE', carrier: 'ACCREDITED' },
      { mga: 'COVER WHALE', carrier: 'EVERSPAN' },
      { mga: 'COVER WHALE', carrier: 'KNIGHT SPECIALTY' },
      { mga: 'COVER WHALE', carrier: 'TRISURA' },
      { mga: 'COVER WHALE', carrier: 'CANOPIUS' },
      { mga: 'COUNTY HALL', carrier: 'COUNTY HALL' },
      { mga: 'NOVATAE', carrier: 'MULTIPLE CARRIERS' },
    ];

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const rel of relationshipsToInsert) {
      try {
        // Buscar MGA
        const mgaEntity = await manager.findOne(Mga, {
          where: { name: rel.mga },
        });

        if (!mgaEntity) {
          console.warn(`⚠️ MGA not found: ${rel.mga}`);
          errorCount++;
          continue;
        }

        // Buscar Carrier
        const carrierEntity = await manager.findOne(Carrier, {
          where: { name: rel.carrier },
        });

        if (!carrierEntity) {
          console.warn(`⚠️ Carrier not found: ${rel.carrier}`);
          errorCount++;
          continue;
        }

        // Verificar si ya existe la relación
        const exists = await manager.findOne(MgaCarrier, {
          where: {
            mga: { id: mgaEntity.id },
            carrier: { id: carrierEntity.id },
          },
        });

        if (!exists) {
          await manager.save(
            MgaCarrier,
            manager.create(MgaCarrier, {
              mga: mgaEntity,
              carrier: carrierEntity,
              concat_name: `${rel.mga} - ${rel.carrier}`,
              is_active: true,
              deleted: false,
            }),
          );
          insertedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`⚠️ Error processing ${rel.mga} - ${rel.carrier}:`, errorMessage);
        errorCount++;
      }
    }

    console.log(
      `✅ MGA-Carrier relationships seeding completed: ${insertedCount} inserted, ${skippedCount} skipped, ${errorCount} errors.`,
    );
  });
};