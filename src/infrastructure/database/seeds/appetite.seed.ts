// import { DataSource } from 'typeorm';
// import { CommodityEntity } from '../entities/commodity.entity';
// import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
// import { AppetiteCommodityEntity } from '../entities/appetite-commodity.entity';

// type AppetiteStatus = 'ACCEPT' | 'DECLINE' | 'REFER';

// interface RawAppetiteRow {
//   /** Must match mga_carrier.concat_name */
//   mgaCarrierConcat: string;
//   /** Must match commodity.name (uppercase recommended) */
//   commodityName: string;
//   status: AppetiteStatus;
//   notes?: string;
// }

// // Populate this array with your real data (can be generated from Excel).
// const RAW_APPETITE_DATA: RawAppetiteRow[] = [
//   // { mgaCarrierConcat: 'MGA X - CARRIER Y', commodityName: 'HAZMAT', status: 'DECLINE', notes: 'Requires prior review.' },
// ];

// export const seedAppetite = async (dataSource: DataSource) => {
//   console.log('⚙️ Starting appetite seeding...');

//   await dataSource.transaction(async (manager) => {
//     const allMgaCarriers = await manager.find(MgaCarrierEntity);
//     const allCommodities = await manager.find(CommodityEntity);

//     const mcByConcat = new Map<string, MgaCarrierEntity>();
//     allMgaCarriers.forEach((mc) => mcByConcat.set(mc.concat_name, mc));

//     const commodityByName = new Map<string, CommodityEntity>();
//     allCommodities.forEach((c) => commodityByName.set(c.name, c));

//     let inserted = 0;
//     let updated = 0;
//     let skipped = 0;

//     for (const row of RAW_APPETITE_DATA) {
//       const mgaCarrier = mcByConcat.get(row.mgaCarrierConcat);
//       if (!mgaCarrier) {
//         console.warn(`⚠️ Skipped: MGA/Carrier "${row.mgaCarrierConcat}" not found.`);
//         skipped++;
//         continue;
//       }

//       const commodity = commodityByName.get(row.commodityName);
//       if (!commodity) {
//         console.warn(`⚠️ Skipped: Commodity "${row.commodityName}" not found.`);
//         skipped++;
//         continue;
//       }

//       const accepted = row.status === 'ACCEPT';

//       const existing = await manager.findOne(AppetiteCommodityEntity, {
//         where: { mgaCarrier: { id: mgaCarrier.id } as any, commodity: { id: commodity.id } as any },
//       });

//       if (!existing) {
//         await manager.save(
//           manager.create(AppetiteCommodityEntity, {
//             mgaCarrier,
//             commodity,
//             accepted,
//             status: row.status,
//             notes: row.notes ?? null,
//             createdBy: 'seed-appetite',
//             updatedBy: 'seed-appetite',
//           }),
//         );
//         inserted++;
//       } else {
//         existing.accepted = accepted;
//         existing.status = row.status;
//         existing.notes = row.notes ?? existing.notes;
//         existing.updatedBy = 'seed-appetite';
//         await manager.save(existing);
//         updated++;
//       }
//     }

//     console.log(`✅ Appetite seeding completed: ${inserted} inserted, ${updated} updated, ${skipped} skipped.`);
//   });
// };
