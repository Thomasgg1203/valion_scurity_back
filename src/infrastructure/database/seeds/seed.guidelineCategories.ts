import { DataSource } from 'typeorm';
import { GuidelineCategoryEntity } from '../entities/guideline_category.entity';

/**
 * 🌱 Seeder for Guideline Categories
 * - Creates the base categories used to group guideline fields
 */
export const seedGuidelineCategories = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Guideline Category seeding...');

  await dataSource.transaction(async (manager) => {
    const categoryRepo = manager.getRepository(GuidelineCategoryEntity);

    const categoriesToInsert = [
      {
        name: 'Vehicle Information',
        description: 'Details about the truck or vehicle operated by the insured.',
        orderIndex: 1,
      },
      {
        name: 'Driver Information',
        description: 'Data related to driver experience and eligibility.',
        orderIndex: 2,
      },
      {
        name: 'Operation Details',
        description: 'Operational factors such as radius, years in business, and authority.',
        orderIndex: 3,
      },
      {
        name: 'Commodity & Cargo',
        description: 'Cargo classification and specific commodity details.',
        orderIndex: 4,
      },
      {
        name: 'Coverage Requirements',
        description: 'Selected coverages and requested liability limits.',
        orderIndex: 5,
      },
      {
        name: 'Safety & Violations',
        description: 'Safety performance, CSA score, inspections, and violations.',
        orderIndex: 6,
      },
      {
        name: 'Company Information',
        description: 'General company information, state availability, and approvals.',
        orderIndex: 7,
      },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const cat of categoriesToInsert) {
      const exists = await categoryRepo.findOne({
        where: { name: cat.name },
      });

      if (!exists) {
        await manager.save(
          categoryRepo.create({
            name: cat.name,
            description: cat.description,
            orderIndex: cat.orderIndex,
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ Guideline Categories seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
