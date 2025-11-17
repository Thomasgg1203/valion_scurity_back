import { DataSource } from 'typeorm';
import { LineOfBusinessEntity } from '../entities/line-of-business.entity';

/**
 * 🌱 Seeder for Line of Business (LOB)
 * - Inserts base lines of business
 */
export const seedLineOfBusiness = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Line of Business seeding...');

  await dataSource.transaction(async (manager) => {
    const lobsToInsert = [
      {
        code: 'DRYVAN',
        name: 'DryVan',
        description: 'Closed trailer used to transport dry goods.',
      },
      {
        code: 'FLATBED',
        name: 'Flatbed',
        description: 'Open flat trailer used for heavy or oversized cargo.',
      },
      {
        code: 'REEFER',
        name: 'Reefer',
        description: 'Refrigerated trailer for perishable goods.',
      },
      {
        code: 'CAR_HAULER',
        name: 'Car Hauler',
        description: 'Vehicle type used to transport multiple cars (car carrier).',
      },
      {
        code: 'FRAC_SAND',
        name: 'Frac Sand',
        description: 'Oil industry business transporting sand used in hydraulic fracturing.',
      },
      {
        code: 'TANK',
        name: 'Tank',
        description: 'Tanker truck used for transporting liquids or chemicals.',
      },
      {
        code: 'MIXER',
        name: 'Mixer',
        description: 'Truck used for mixing and transporting cement or other construction materials.',
      },
      {
        code: 'INTERMODAL',
        name: 'Intermodal',
        description: 'Business authorized to access ports and transport containers.',
      },
      {
        code: 'HOUSEHOLD_GOODS',
        name: 'Household Goods Movers',
        description: 'Businesses that move appliances or household goods (also moving companies).',
      },
      {
        code: 'LIVESTOCK',
        name: 'Livestock',
        description: 'Business transporting farm animals and agricultural products.',
      },
      {
        code: 'HAZARDOUS',
        name: 'Hazardous Materials',
        description: 'Business that handles and transports chemical or dangerous materials.',
      },
      {
        code: 'TOWING',
        name: 'Towing',
        description: 'Business that tows vehicles unable to move on their own.',
      },
      {
        code: 'DNA',
        name: 'Does Not Apply',
        description: 'Used when the business type does not fit any category.',
      },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const lob of lobsToInsert) {
      const exists = await manager.findOne(LineOfBusinessEntity, {
        where: { code: lob.code },
      });

      if (!exists) {
        await manager.save(
          LineOfBusinessEntity,
          manager.create(LineOfBusinessEntity, {
            code: lob.code,
            name: lob.name,
            description: lob.description,
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ Line of Business seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`);
  });
};
