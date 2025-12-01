import { DataSource } from 'typeorm';
import { CommodityEntity } from '../entities/commodity.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
import { AppetiteCommodityEntity } from '../entities/appetite-commodity.entity';

/**
 * 🌱 Seeder for default NOT-ACCEPTED commodities
 * - Links each MGA–Carrier with commodities marked as not accepted or restricted
 */
export const seedCommodityNoAccept = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Commodity NO-ACCEPT seeding...');

  await dataSource.transaction(async (manager) => {
    const mgaCarrierRepo = manager.getRepository(MgaCarrierEntity);
    const commodityRepo = manager.getRepository(CommodityEntity);
    const appetiteRepo = manager.getRepository(AppetiteCommodityEntity);

    // Load all MGA–Carrier relations
    const allMgaCarriers = await mgaCarrierRepo.find();
    if (!allMgaCarriers.length) {
      console.warn('⚠️ No MGA–Carrier relations found. Skipping.');
      return;
    }

    // Load all commodities
    const allCommodities = await commodityRepo.find();
    if (!allCommodities.length) {
      console.warn('⚠️ No commodities found. Skipping.');
      return;
    }

    // ===============================
    // Commodities that are typically NOT accepted by default
    // (Based on underwriting Excel logic)
    // ===============================
    const defaultNoAccept = ['Hazmat', 'Livestock', 'Oversized Loads', 'Waste', 'Frac Sand'];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const mc of allMgaCarriers) {
      for (const com of allCommodities) {
        // Only insert if commodity matches a NO-ACCEPT profile
        const shouldDecline = defaultNoAccept.includes(com.name);

        if (!shouldDecline) continue;

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
              accepted: false,
              status: 'DECLINED',
              notes: `Default Decline for ${com.name}`,
              createdAt: new Date(),
            }),
          );
          insertedCount++;
        } else {
          skippedCount++;
        }
      }
    }

    console.log(
      `✅ Commodity NO-ACCEPT seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
