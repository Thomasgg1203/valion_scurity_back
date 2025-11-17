import { DataSource } from 'typeorm';
import { StateEntity } from '../entities/state.entity';


export const seedStates = async (dataSource: DataSource) => {
  console.log('⚙️ Starting states seeding...');

  await dataSource.transaction(async (manager) => {
    const statesToInsert = [
      { code: 'AL', name: 'Alabama' },
      { code: 'CA', name: 'California' },
      { code: 'FL', name: 'Florida' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'TX', name: 'Texas' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'DE', name: 'Delaware' },
      { code: 'CO', name: 'Colorado' },
      { code: 'GA', name: 'Georgia' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IA', name: 'Iowa' },
      { code: 'IN', name: 'Indiana' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'UT', name: 'Utah' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'IL', name: 'Illinois' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'NV', name: 'Nevada' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'MT', name: 'Montana' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'KS', name: 'Kansas' },
      { code: 'DC', name: 'District of Columbia' },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const state of statesToInsert) {
      const exists = await manager.findOne(StateEntity, {
        where: { code: state.code },
      });

      if (!exists) {
        await manager.save(
          StateEntity,
          manager.create(StateEntity, {
            code: state.code,
            name: state.name,
            createdAt: new Date()
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ States seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`);
  });
};