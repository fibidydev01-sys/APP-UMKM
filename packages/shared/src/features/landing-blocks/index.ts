'use client';

/**
 * Landing Feature Module
 *
 * Public store display components - READ & RENDER landing config
 * Contains all rendering blocks for tenant landing pages
 * (hero, about, products, testimonials, contact, CTA sections)
 */

export * from './components';

// Re-export TemplateProvider from the same bundle to avoid context mismatch
// When tsup bundles with splitting: false, each entry point has its own copy of Context
// This ensures components and provider use the same Context instance
export { TemplateProvider, useTemplate } from '../../lib/landing-templates';
