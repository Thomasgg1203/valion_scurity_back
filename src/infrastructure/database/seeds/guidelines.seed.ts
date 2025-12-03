import { DataSource } from 'typeorm';

import { seedGuidelineCategories } from './seed.guidelineCategories';
import { seedGuidelineFields } from './seed.guideline-field';
import { seedGuidelineRules } from './seed.guideline-rule';
import { seedStateRules } from './seed.state_rule';
import { seedExclusions } from './seed.exclusion';
import { seedQueryPresets } from './seed.query_preset';

/**
 * 🌱 Master seed para TODO lo relacionado con GUIDELINES
 *
 * Se apoya en los seeds granulares que ya tienes:
 *  - Categorías de guideline
 *  - Campos
 *  - Reglas (guideline_rule)
 *  - Reglas por estado (state_rule)
 *  - Exclusiones (exclusion)
 *  - Query presets para el panel
 */
export async function seedGuidelines(dataSource: DataSource): Promise<void> {
  console.log('🔹 [GuidelinesSeed] Iniciando seed de guidelines…');

  // 1. Categorías (orden y grupos del Excel)
  console.log('   ➤ seedGuidelineCategories');
  await seedGuidelineCategories(dataSource);

  // 2. Campos (radius, years in business, commodity, etc.)
  console.log('   ➤ seedGuidelineFields');
  await seedGuidelineFields(dataSource);

  // 3. Reglas generales: radius, unit count, commodities, etc.
  console.log('   ➤ seedGuidelineRules');
  await seedGuidelineRules(dataSource);

  // 4. Reglas por estado (no CA, solo TX/FL, etc.)
  console.log('   ➤ seedStateRules');
  await seedStateRules(dataSource);

  // 5. Exclusiones específicas (ej. Oil & Gas / NYC / Hazmat explosivos)
  console.log('   ➤ seedExclusions');
  await seedExclusions(dataSource);

  // 6. Filtros guardados para el query panel
  console.log('   ➤ seedQueryPresets');
  await seedQueryPresets(dataSource);

  console.log('✅ [GuidelinesSeed] Guidelines sembrados correctamente.');
}
