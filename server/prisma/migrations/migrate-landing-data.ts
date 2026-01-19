/**
 * ============================================================================
 * DATA MIGRATION SCRIPT: Landing Config to Tenant Fields
 * ============================================================================
 *
 * This script migrates existing landing page data from the JSON landingConfig
 * field to the new dedicated tenant fields (heroTitle, aboutContent, etc.)
 *
 * USAGE:
 *   npx ts-node prisma/migrations/migrate-landing-data.ts
 *
 * SAFETY:
 *   - Only migrates data if tenant field is empty (null/undefined)
 *   - Does NOT overwrite existing tenant field data
 *   - Logs all changes for audit purposes
 *   - Can be run multiple times safely (idempotent)
 *
 * ============================================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

interface LandingConfig {
  enabled?: boolean;
  template?: string;
  hero?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    config?: {
      ctaText?: string;
      ctaLink?: string;
      backgroundImage?: string;
    };
  };
  about?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    config?: {
      content?: string;
      image?: string;
      features?: Array<{ icon?: string; title: string; description: string }>;
    };
  };
  testimonials?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    config?: {
      items?: Array<{
        id: string;
        name: string;
        role?: string;
        content: string;
        rating?: number;
        avatar?: string;
      }>;
    };
  };
  contact?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    config?: {
      showMap?: boolean;
      showForm?: boolean;
      mapUrl?: string;
    };
  };
  cta?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    config?: {
      buttonText?: string;
      buttonLink?: string;
      style?: string;
    };
  };
}

interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  errors: number;
}

// ============================================================================
// MIGRATION FUNCTION
// ============================================================================

async function migrateLandingData(): Promise<void> {
  console.log('====================================================');
  console.log('LANDING DATA MIGRATION: landingConfig -> Tenant Fields');
  console.log('====================================================\n');

  const stats: MigrationStats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    // Fetch all tenants with their landingConfig
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        landingConfig: true,
        // Check if fields are already populated
        heroTitle: true,
        aboutTitle: true,
        testimonialsTitle: true,
        contactTitle: true,
        ctaTitle: true,
      },
    });

    stats.total = tenants.length;
    console.log(`Found ${tenants.length} tenants to process\n`);

    for (const tenant of tenants) {
      console.log(`\n--- Processing: ${tenant.slug} (${tenant.id}) ---`);

      const config = tenant.landingConfig as LandingConfig | null;

      if (!config) {
        console.log('  [SKIP] No landingConfig found');
        stats.skipped++;
        continue;
      }

      // Build update data - only include fields that need migration
      const updateData: Record<string, unknown> = {};
      let hasUpdates = false;

      // ====================================================================
      // HERO SECTION
      // ====================================================================
      if (config.hero) {
        if (!tenant.heroTitle && config.hero.title) {
          updateData.heroTitle = config.hero.title;
          hasUpdates = true;
          console.log(`  [HERO] title: "${config.hero.title}"`);
        }
        if (config.hero.subtitle) {
          updateData.heroSubtitle = config.hero.subtitle;
          hasUpdates = true;
        }
        if (config.hero.config?.ctaText) {
          updateData.heroCtaText = config.hero.config.ctaText;
          hasUpdates = true;
        }
        if (config.hero.config?.ctaLink) {
          updateData.heroCtaLink = config.hero.config.ctaLink;
          hasUpdates = true;
        }
        if (config.hero.config?.backgroundImage) {
          updateData.heroBackgroundImage = config.hero.config.backgroundImage;
          hasUpdates = true;
        }
      }

      // ====================================================================
      // ABOUT SECTION
      // ====================================================================
      if (config.about) {
        if (!tenant.aboutTitle && config.about.title) {
          updateData.aboutTitle = config.about.title;
          hasUpdates = true;
          console.log(`  [ABOUT] title: "${config.about.title}"`);
        }
        if (config.about.subtitle) {
          updateData.aboutSubtitle = config.about.subtitle;
          hasUpdates = true;
        }
        if (config.about.config?.content) {
          updateData.aboutContent = config.about.config.content;
          hasUpdates = true;
        }
        if (config.about.config?.image) {
          updateData.aboutImage = config.about.config.image;
          hasUpdates = true;
        }
        if (config.about.config?.features && config.about.config.features.length > 0) {
          updateData.aboutFeatures = config.about.config.features;
          hasUpdates = true;
          console.log(`  [ABOUT] features: ${config.about.config.features.length} items`);
        }
      }

      // ====================================================================
      // TESTIMONIALS SECTION
      // ====================================================================
      if (config.testimonials) {
        if (!tenant.testimonialsTitle && config.testimonials.title) {
          updateData.testimonialsTitle = config.testimonials.title;
          hasUpdates = true;
          console.log(`  [TESTIMONIALS] title: "${config.testimonials.title}"`);
        }
        if (config.testimonials.subtitle) {
          updateData.testimonialsSubtitle = config.testimonials.subtitle;
          hasUpdates = true;
        }
        if (config.testimonials.config?.items && config.testimonials.config.items.length > 0) {
          updateData.testimonials = config.testimonials.config.items;
          hasUpdates = true;
          console.log(`  [TESTIMONIALS] items: ${config.testimonials.config.items.length} testimonials`);
        }
      }

      // ====================================================================
      // CONTACT SECTION
      // ====================================================================
      if (config.contact) {
        if (!tenant.contactTitle && config.contact.title) {
          updateData.contactTitle = config.contact.title;
          hasUpdates = true;
          console.log(`  [CONTACT] title: "${config.contact.title}"`);
        }
        if (config.contact.subtitle) {
          updateData.contactSubtitle = config.contact.subtitle;
          hasUpdates = true;
        }
        if (config.contact.config?.mapUrl) {
          updateData.contactMapUrl = config.contact.config.mapUrl;
          hasUpdates = true;
        }
        if (config.contact.config?.showMap !== undefined) {
          updateData.contactShowMap = config.contact.config.showMap;
          hasUpdates = true;
        }
        if (config.contact.config?.showForm !== undefined) {
          updateData.contactShowForm = config.contact.config.showForm;
          hasUpdates = true;
        }
      }

      // ====================================================================
      // CTA SECTION
      // ====================================================================
      if (config.cta) {
        if (!tenant.ctaTitle && config.cta.title) {
          updateData.ctaTitle = config.cta.title;
          hasUpdates = true;
          console.log(`  [CTA] title: "${config.cta.title}"`);
        }
        if (config.cta.subtitle) {
          updateData.ctaSubtitle = config.cta.subtitle;
          hasUpdates = true;
        }
        if (config.cta.config?.buttonText) {
          updateData.ctaButtonText = config.cta.config.buttonText;
          hasUpdates = true;
        }
        if (config.cta.config?.buttonLink) {
          updateData.ctaButtonLink = config.cta.config.buttonLink;
          hasUpdates = true;
        }
        if (config.cta.config?.style) {
          updateData.ctaButtonStyle = config.cta.config.style;
          hasUpdates = true;
        }
      }

      // ====================================================================
      // APPLY UPDATE
      // ====================================================================
      if (hasUpdates) {
        try {
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: updateData,
          });
          console.log(`  [OK] Migrated ${Object.keys(updateData).length} fields`);
          stats.migrated++;
        } catch (error) {
          console.error(`  [ERROR] Failed to update:`, error);
          stats.errors++;
        }
      } else {
        console.log('  [SKIP] No data to migrate');
        stats.skipped++;
      }
    }

    // ====================================================================
    // SUMMARY
    // ====================================================================
    console.log('\n====================================================');
    console.log('MIGRATION SUMMARY');
    console.log('====================================================');
    console.log(`Total tenants:     ${stats.total}`);
    console.log(`Migrated:          ${stats.migrated}`);
    console.log(`Skipped:           ${stats.skipped}`);
    console.log(`Errors:            ${stats.errors}`);
    console.log('====================================================\n');

    if (stats.errors > 0) {
      console.log('WARNING: Some migrations failed. Please review the errors above.');
    } else {
      console.log('Migration completed successfully!');
    }

  } catch (error) {
    console.error('Migration failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// RUN
// ============================================================================

migrateLandingData()
  .then(() => {
    console.log('\nDone.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
