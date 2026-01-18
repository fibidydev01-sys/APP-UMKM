// ==========================================
// VARIANT → BLOCK MIGRATION SCRIPT
// ==========================================
// 🚀 One-time migration to rename "variant" keys to "block" in landingConfig JSONB
//
// USAGE:
//   npm run migrate:variant-to-block
//
// SAFETY:
//   - Creates backup of all affected records
//   - Can be rolled back if needed
//   - Idempotent (safe to run multiple times)
// ==========================================

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LandingSection {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  variant?: string; // OLD
  block?: string; // NEW
  config?: Record<string, unknown>;
}

interface LandingConfig {
  enabled?: boolean;
  template?: string;
  hero?: LandingSection;
  about?: LandingSection;
  products?: LandingSection;
  testimonials?: LandingSection;
  contact?: LandingSection;
  cta?: LandingSection;
}

/**
 * Migrate a single section: rename "variant" → "block"
 */
function migrateSection(section: LandingSection | undefined): LandingSection | undefined {
  if (!section) return section;

  const migrated = { ...section };

  // If "variant" exists, rename it to "block"
  if ('variant' in migrated && migrated.variant !== undefined) {
    migrated.block = migrated.variant;
    delete migrated.variant;
  }

  return migrated;
}

/**
 * Migrate entire landing config
 */
function migrateLandingConfig(config: LandingConfig): LandingConfig {
  return {
    enabled: config.enabled,
    template: config.template,
    hero: migrateSection(config.hero),
    about: migrateSection(config.about),
    products: migrateSection(config.products),
    testimonials: migrateSection(config.testimonials),
    contact: migrateSection(config.contact),
    cta: migrateSection(config.cta),
  };
}

/**
 * Create backup file
 */
function createBackup(data: any[]): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../../backups');

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, `variant-to-block-backup-${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));

  return backupFile;
}

/**
 * Main migration function
 */
async function migrateVariantToBlock() {
  console.log('🚀 Starting variant → block migration...\n');

  try {
    // Step 1: Find all tenants with landingConfig
    console.log('📊 Fetching tenants with landing config...');
    const tenants = await prisma.tenant.findMany({
      where: {
        landingConfig: {
          not: null,
        },
      },
      select: {
        id: true,
        slug: true,
        landingConfig: true,
      },
    });

    console.log(`   Found ${tenants.length} tenants with landing config\n`);

    if (tenants.length === 0) {
      console.log('✅ No tenants to migrate. Exiting...');
      return;
    }

    // Step 2: Create backup
    console.log('💾 Creating backup...');
    const backupFile = createBackup(tenants);
    console.log(`   Backup saved to: ${backupFile}\n`);

    // Step 3: Analyze what will be migrated
    let totalSectionsToMigrate = 0;
    const tenantsToMigrate: string[] = [];

    for (const tenant of tenants) {
      const config = tenant.landingConfig as LandingConfig;
      let hasVariant = false;

      const sections = ['hero', 'about', 'products', 'testimonials', 'contact', 'cta'] as const;
      for (const section of sections) {
        if (config[section] && 'variant' in config[section]!) {
          hasVariant = true;
          totalSectionsToMigrate++;
        }
      }

      if (hasVariant) {
        tenantsToMigrate.push(tenant.slug);
      }
    }

    console.log('📋 Migration Summary:');
    console.log(`   Tenants to migrate: ${tenantsToMigrate.length}`);
    console.log(`   Sections to migrate: ${totalSectionsToMigrate}`);
    console.log(`   Tenants: ${tenantsToMigrate.join(', ')}\n`);

    if (tenantsToMigrate.length === 0) {
      console.log('✅ All configs already use "block" field. No migration needed!');
      return;
    }

    // Step 4: Perform migration
    console.log('🔄 Migrating configs...');
    let migratedCount = 0;

    for (const tenant of tenants) {
      const config = tenant.landingConfig as LandingConfig;
      const migratedConfig = migrateLandingConfig(config);

      // Only update if something changed
      if (JSON.stringify(config) !== JSON.stringify(migratedConfig)) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: { landingConfig: migratedConfig as any },
        });
        migratedCount++;
        console.log(`   ✅ Migrated: ${tenant.slug}`);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   ${migratedCount} tenants migrated`);
    console.log(`   ${totalSectionsToMigrate} sections updated`);
    console.log(`\n💡 Backup location: ${backupFile}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Rollback migration (restore from backup)
 */
async function rollbackMigration(backupFilePath: string) {
  console.log('🔙 Starting rollback...\n');

  try {
    // Read backup file
    console.log(`📂 Reading backup: ${backupFilePath}`);
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

    console.log(`   Found ${backupData.length} tenants in backup\n`);

    // Restore data
    console.log('🔄 Restoring data...');
    let restoredCount = 0;

    for (const tenant of backupData) {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { landingConfig: tenant.landingConfig },
      });
      restoredCount++;
      console.log(`   ✅ Restored: ${tenant.slug}`);
    }

    console.log(`\n✅ Rollback complete! ${restoredCount} tenants restored.`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// ==========================================
// CLI EXECUTION
// ==========================================

const command = process.argv[2];

if (command === 'migrate') {
  migrateVariantToBlock()
    .then(() => {
      console.log('\n🎉 Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
} else if (command === 'rollback') {
  const backupFile = process.argv[3];
  if (!backupFile) {
    console.error('❌ Please provide backup file path');
    console.log('Usage: npm run migrate:variant-to-block rollback <backup-file-path>');
    process.exit(1);
  }

  rollbackMigration(backupFile)
    .then(() => {
      console.log('\n🎉 Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
} else {
  console.log('Usage:');
  console.log('  Migrate:  npm run migrate:variant-to-block migrate');
  console.log('  Rollback: npm run migrate:variant-to-block rollback <backup-file-path>');
  process.exit(1);
}
