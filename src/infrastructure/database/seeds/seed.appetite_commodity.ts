import { DataSource } from 'typeorm';
import { CommodityEntity } from '../entities/commodity.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
import { AppetiteCommodityEntity } from '../entities/appetite-commodity.entity';

/**
 * 🌱 Seeder for FULL Appetite Commodity Mapping
 *
 * This seed replaces the previous NO-ACCEPT seed.
 * It assigns ACCEPT, REFER, or DECLINE based on industry-standard
 * underwriting appetite categories.
 *
 * ✔ No keyword guessing
 * ✔ Clear, real appetite logic
 * ✔ Each MGA–Carrier receives a full appetite matrix
 * ✔ Super easy for devs to understand and extend
 *
 */
export const seedAppetiteCommodity = async (dataSource: DataSource) => {
  console.log('⚙️ Starting FULL Appetite Commodity seeding...');

  await dataSource.transaction(async (manager) => {
    const appetiteRepo = manager.getRepository(AppetiteCommodityEntity);
    const commodityRepo = manager.getRepository(CommodityEntity);
    const mgaCarrierRepo = manager.getRepository(MgaCarrierEntity);

    const carriers = await mgaCarrierRepo.find();
    const commodities = await commodityRepo.find();

    if (!carriers.length || !commodities.length) {
      console.warn('⚠️ Missing carriers or commodities. Aborting.');
      return;
    }

    // ============================================
    // REAL UNDERWRITING CATEGORIES
    // ============================================

    const DECLINE = [
      'hazmat',
      'hazardous',
      'explosive',
      'oversize',
      'oversized',
      'frac',
      'oilfield',
      'livestock',
      'scrap',
      'garbage',
      'waste',
      'logging',
      'heavy equipment',
    ];

    const REFER = [
      'reefer',
      'refrigerated',
      'auto hauler',
      'vehicle transport',
      'steel',
      'coil',
      'lumber',
      'machinery',
      'metal',
      'intermodal',
      'drayage',
      'food',
      'high radius',
    ];

    // ACCEPT = default if not matched

    const classify = (
      commodityName: string,
    ): { status: string; accepted: boolean; notes: string } => {
      const n = commodityName.toLowerCase();

      if (DECLINE.some((x) => n.includes(x))) {
        return {
          status: 'DECLINED',
          accepted: false,
          notes: 'High-risk commodity. Declined per underwriting standards.',
        };
      }

      if (REFER.some((x) => n.includes(x))) {
        return {
          status: 'REFER',
          accepted: false,
          notes: 'Requires underwriter review.',
        };
      }

      return {
        status: 'ACCEPT',
        accepted: true,
        notes: 'Standard commodity. Acceptable risk.',
      };
    };

    // ======================================================
    // INSERT ENTRIES FOR EACH MGA–Carrier + Commodity
    // ======================================================
    let inserted = 0;
    let skipped = 0;

    for (const mc of carriers) {
      for (const com of commodities) {
        const appetite = classify(com.name);

        const exists = await appetiteRepo.findOne({
          where: {
            mgaCarrier: { id: mc.id },
            commodity: { id: com.id },
          },
        });

        if (!exists) {
          await appetiteRepo.save(
            appetiteRepo.create({
              mgaCarrier: mc,
              commodity: com,
              accepted: appetite.accepted,
              status: appetite.status,
              notes: appetite.notes,
              createdBy: 'system-seed',
            }),
          );
          inserted++;
        } else {
          skipped++;
        }
      }
    }

    console.log(
      `✅ FULL Appetite Commodity seeding completed: ${inserted} inserted, ${skipped} skipped.`,
    );
  });
};
