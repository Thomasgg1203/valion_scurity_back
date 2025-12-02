import { DataSource } from 'typeorm';
import { GuidelineCategoryEntity } from '../entities/guideline_category.entity';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';

export const seedGuidelineFields = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Guideline Fields seeding...');

  await dataSource.transaction(async (manager) => {
    const categoryRepo = manager.getRepository(GuidelineCategoryEntity);
    const fieldRepo = manager.getRepository(GuidelineFieldEntity);

    const categories = await categoryRepo.find();
    const categoryMap = new Map<string, GuidelineCategoryEntity>();
    categories.forEach((cat) => categoryMap.set(cat.name, cat));

    const required = [
      'Vehicle Information',
      'Driver Information',
      'Operation Details',
      'Commodity & Cargo',
      'Coverage Requirements',
      'Safety & Violations',
      'Company Information',
    ];

    for (const cat of required) {
      if (!categoryMap.has(cat)) {
        console.warn(`❌ Missing category: ${cat}`);
        return;
      }
    }

    const fieldsToInsert = [
      {
        category: 'Vehicle Information',
        name: 'vehicle_year',
        type: 'number',
      },
      {
        category: 'Vehicle Information',
        name: 'vehicle_type',
        type: 'select',
        possible_values: 'Truck,Trailer,Tractor,Reefer,Flatbed',
      },
      {
        category: 'Vehicle Information',
        name: 'unit_count',
        type: 'number',
      },
      {
        category: 'Vehicle Information',
        name: 'is_trailer',
        type: 'boolean',
      },

      // DRIVER INFO
      {
        category: 'Driver Information',
        name: 'driver_age',
        type: 'number',
      },
      {
        category: 'Driver Information',
        name: 'years_experience',
        type: 'number',
      },
      {
        category: 'Driver Information',
        name: 'has_cdl',
        type: 'boolean',
      },

      // OPERATION DETAILS
      {
        category: 'Operation Details',
        name: 'radius',
        type: 'number',
      },
      {
        category: 'Operation Details',
        name: 'operation_states',
        type: 'multiselect',
      },
      {
        category: 'Operation Details',
        name: 'years_in_business',
        type: 'number',
      },
      {
        category: 'Operation Details',
        name: 'authority_active',
        type: 'boolean',
      },

      // COMMODITY & CARGO
      {
        category: 'Commodity & Cargo',
        name: 'commodity_type',
        type: 'select',
      },
      {
        category: 'Commodity & Cargo',
        name: 'is_hazmat',
        type: 'boolean',
      },
      {
        category: 'Commodity & Cargo',
        name: 'temp_control',
        type: 'boolean',
      },

      // COVERAGE REQUIREMENTS
      {
        category: 'Coverage Requirements',
        name: 'requested_liability_limit',
        type: 'select',
        possible_values: '100000,250000,500000,1000000',
      },
      {
        category: 'Coverage Requirements',
        name: 'requested_coverages',
        type: 'multiselect',
      },

      // SAFETY & VIOLATIONS
      {
        category: 'Safety & Violations',
        name: 'accidents_last_3_years',
        type: 'number',
      },
      {
        category: 'Safety & Violations',
        name: 'violations_count',
        type: 'number',
      },
      {
        category: 'Safety & Violations',
        name: 'csa_score',
        type: 'number',
      },

      // COMPANY INFORMATION
      {
        category: 'Company Information',
        name: 'company_name',
        type: 'string',
      },
      {
        category: 'Company Information',
        name: 'dot_number',
        type: 'string',
      },
      {
        category: 'Company Information',
        name: 'mc_number',
        type: 'string',
      },
    ];

    let insertedCount = 0;
    let skippedCount = 0;

    for (const f of fieldsToInsert) {
      const catEntity = categoryMap.get(f.category);
      if (!catEntity) continue;

      const exists = await fieldRepo.findOne({
        where: { name: f.name, category: { id: catEntity.id } },
      });

      if (!exists) {
        await fieldRepo.save(
          fieldRepo.create({
            category: catEntity,
            name: f.name,
            type: f.type,
            possible_values: f.possible_values ?? undefined,
          }),
        );
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(
      `✅ Guideline Fields seeding completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
    );
  });
};
