import { DataSource } from 'typeorm';
import { CoverageEntity } from '../entities/coverage.entity';
import { LineOfBusinessEntity } from '../entities/line-of-business.entity';

/**
 * 🌱 Seeder for Coverage
 * - Inserts default coverages and links them to their Line of Business
 */
export const seedCoverages = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Coverage seeding...');

  await dataSource.transaction(async (manager) => {
    const lobRepo = manager.getRepository(LineOfBusinessEntity);
    const coverageRepo = manager.getRepository(CoverageEntity);
    const lobMap = new Map<string, LineOfBusinessEntity>();

    // ===============================
    // COVERAGES AND THEIR LOB MAPPING
    // ===============================
    const coverageData = [
      // ==== AUTO LIABILITY ====
      {
        code: 'CSL',
        name: 'Auto Liability (Combined Single Limit)',
        description: 'Auto liability, covers bodily injury and property damage.',
        lobCode: 'DRYVAN',
      },

      // ==== MOTOR TRUCK CARGO ====
      {
        code: 'MTC',
        name: 'Motor Truck Cargo',
        description: 'Protects the cargo against theft or collision during transport.',
        lobCode: 'FRAC_SAND',
      },

      // ==== PHYSICAL DAMAGE ====
      {
        code: 'PD',
        name: 'Physical Damage',
        description:
          'Covers the truck against physical damage from natural disasters, theft, or collision.',
        lobCode: 'TANK', // Carro tanque o vehículo pesado
      },

      // ==== GENERAL LIABILITY ====
      {
        code: 'GL',
        name: 'General Liability',
        description: 'Similar to auto liability but for private property operations.',
        lobCode: 'INTERMODAL',
      },

      // ==== TRAILER INTERCHANGE ====
      {
        code: 'TI',
        name: 'Trailer Interchange (Reefer)',
        description: 'Covers any trailer attached to the insured truck, including reefer units.',
        lobCode: 'REEFER',
      },

      // ==== WORKER COMPENSATION ====
      {
        code: 'WC',
        name: 'Worker Compensation',
        description:
          'Mandatory insurance protecting employees and employers from work-related injury or illness.',
        lobCode: 'DNA',
      },

      // ==== OCCUPATIONAL ACCIDENT ====
      {
        code: 'OA',
        name: 'Occupational Accident',
        description: 'Coverage for occupational injuries or driver accidents.',
        lobCode: 'CAR_HAULER',
      },

      // ==== UMBRELLA ====
      {
        code: 'UMBRELLA',
        name: 'Umbrella Coverage',
        description: 'Extends all coverages providing broader liability protection.',
        lobCode: 'DNA',
      },

      // ==== EXCESS ====
      {
        code: 'EXCESS',
        name: 'Excess Liability',
        description: 'Extension of a single coverage with higher liability limits.',
        lobCode: 'DNA',
      },

      // ==== NON-TRUCKING LIABILITY ====
      {
        code: 'NTL',
        name: 'Non-Trucking Liability',
        description:
          'Covers non-commercial liability when the truck is not under dispatch; from point A to B (e.g., leaving the dealer).',
        lobCode: 'DRYVAN',
      },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const cov of coverageData) {
      // Cache LOB lookup
      if (!lobMap.has(cov.lobCode)) {
        const lob = await lobRepo.findOne({ where: { code: cov.lobCode } });
        if (lob) lobMap.set(cov.lobCode, lob);
      }

      const lob = lobMap.get(cov.lobCode);
      if (!lob) {
        console.warn(`⚠️ LOB not found for coverage: ${cov.code} (${cov.lobCode})`);
        continue;
      }

      const exists = await coverageRepo.findOne({ where: { code: cov.code } });
      if (!exists) {
        await manager.save(
          CoverageEntity,
          manager.create(CoverageEntity, {
            code: cov.code,
            name: cov.name,
            description: cov.description,
            lob,
            createdAt: new Date(),
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ Coverage seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
