// src/database/seeds/appetite.seed.ts
import { DataSource } from 'typeorm';

// 👇 Seeds que SÍ existen en tu repo
import { seedCommodities } from './seed.commodity';

import { seedAppetiteCommodity } from './seed.appetite_commodity';

/**
 * 🌱 Master seed para APPETITE
 *
 * Basado 100% en los archivos que existen en tu repositorio:
 *   - seed.commodity.ts
 *   - seed.commodity-no-accept.ts
 *   - seed.appetite_commodity.ts
 */
export async function seedAppetite(dataSource: DataSource): Promise<void> {
  console.log('🔹 [AppetiteSeed] Iniciando seed de appetite…');

  // 1. Catálogo base de commodities (Dry Van, Hazmat, Oilfield, etc.)
  console.log('   ➤ seedCommodities');
  await seedCommodities(dataSource);

  // 2. Commodities que están marcados como NO-ACCEPT según el Excel
  console.log('   ➤ seedCommoditiesNoAccept');
  await seedCommoditiesNoAccept(dataSource);

  // 3. Mapa MGA–Carrier–Commodity con status ACCEPT / REFER / DECLINE
  console.log('   ➤ seedAppetiteCommodity');
  await seedAppetiteCommodity(dataSource);

  console.log('✅ [AppetiteSeed] Appetite sembrado correctamente.');
}
