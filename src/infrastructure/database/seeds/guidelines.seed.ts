import { DataSource } from 'typeorm';
import { GuidelineCategoryEntity } from '../entities/guideline_category.entity';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';

type RawCategory = {
  name: string;
  description: string;
  orderIndex: number;
};

type RawField = {
  categoryName: string;
  name: string;
  type: string;
  possibleValues?: string[];
};

/**
 * Add your real data here (can be generated from Excel).
 * Do not modify column names; entities use:
 *  - GuidelineCategoryEntity: name, description, orderIndex
 *  - GuidelineFieldEntity: name, type, possible_values (text)
 */
const RAW_GUIDELINE_CATEGORIES: RawCategory[] = [
  // { name: 'Vehicle Information', description: '...', orderIndex: 1 },
];

const RAW_GUIDELINE_FIELDS: RawField[] = [
  // { categoryName: 'Vehicle Information', name: 'vehicle_year', type: 'number' },
  // { categoryName: 'Vehicle Information', name: 'vehicle_type', type: 'select', possibleValues: ['Truck','Trailer'] },
];

export const seedGuidelines = async (dataSource: DataSource) => {
  console.log('⚙️ Starting guideline categories & fields seeding...');

  await dataSource.transaction(async (manager) => {
    // Seed categories
    let catInserted = 0;
    let catSkipped = 0;

    for (const raw of RAW_GUIDELINE_CATEGORIES) {
      const exists = await manager.findOne(GuidelineCategoryEntity, { where: { name: raw.name } });
      if (!exists) {
        await manager.save(
          manager.create(GuidelineCategoryEntity, {
            name: raw.name,
            description: raw.description,
            orderIndex: raw.orderIndex,
          }),
        );
        catInserted++;
      } else {
        catSkipped++;
      }
    }

    console.log(`✅ Guideline categories: ${catInserted} inserted, ${catSkipped} skipped.`);

    const allCategories = await manager.find(GuidelineCategoryEntity);
    const catByName = new Map<string, GuidelineCategoryEntity>();
    allCategories.forEach((c) => catByName.set(c.name, c));

    // Seed fields
    let fieldInserted = 0;
    let fieldSkipped = 0;

    for (const raw of RAW_GUIDELINE_FIELDS) {
      const category = catByName.get(raw.categoryName);
      if (!category) {
        console.warn(
          `⚠️ GuidelineField "${raw.name}" skipped: category "${raw.categoryName}" not found.`,
        );
        continue;
      }

      const exists = await manager.findOne(GuidelineFieldEntity, {
        where: { name: raw.name, category: { id: category.id } as any },
      });

      if (!exists) {
        await manager.save(
          manager.create(GuidelineFieldEntity, {
            category,
            name: raw.name,
            type: raw.type,
            possible_values: raw.possibleValues ? JSON.stringify(raw.possibleValues) : null,
          }),
        );
        fieldInserted++;
      } else {
        fieldSkipped++;
      }
    }

    console.log(`✅ Guideline fields: ${fieldInserted} inserted, ${fieldSkipped} skipped.`);
  });

  console.log('🌱 Guidelines seeding completed.');
};
