import { DataSource } from 'typeorm';
import { CommodityEntity } from '../entities/commodity.entity';

/**
 * 🌱 Seeder for Commodity
 * - Loads all cargo/risk types defined in the Excel
 */
export const seedCommodities = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Commodity seeding...');

  await dataSource.transaction(async (manager) => {
    const commodityRepo = manager.getRepository(CommodityEntity);

    // ===============================
    // COMMODITIES BASED ON THE EXCEL
    // ===============================
    const commoditiesToInsert = [
      { name: 'Hazmat', description: 'Hazardous materials transportation.' },
      { name: 'General Freight', description: 'General dry cargo and misc goods.' },
      { name: 'Livestock', description: 'Transport of live animals.' },
      { name: 'Flatbed', description: 'Cargo transported on flatbed trucks.' },
      { name: 'Reefer', description: 'Refrigerated or temperature-controlled cargo.' },
      { name: 'Dry Van', description: 'Standard enclosed trailer cargo.' },
      { name: 'Intermodal', description: 'Containerized intermodal freight.' },
      { name: 'Car Hauler', description: 'Vehicles transported on car carriers.' },
      { name: 'Oversized Loads', description: 'Cargo exceeding legal size limits.' },
      { name: 'Frac Sand', description: 'Oilfield and frac sand transportation.' },
      { name: 'Construction Materials', description: 'Materials used for construction.' },
      { name: 'Household Goods', description: 'Furniture and residential relocation cargo.' },
      { name: 'Waste', description: 'Transport of garbage or waste materials.' },
      { name: 'Containers', description: 'ISO containers transported via truck.' },
      { name: 'Bulk', description: 'Unpackaged bulk commodities (grains, minerals).' },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const com of commoditiesToInsert) {
      const exists = await commodityRepo.findOne({
        where: { name: com.name },
      });

      if (!exists) {
        await manager.save(
          CommodityEntity,
          manager.create(CommodityEntity, {
            name: com.name,
            description: com.description,
            deleted: false,
            createdAt: new Date(),
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ Commodity seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
