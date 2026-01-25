#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');

// Files that need 'use client' directive
// Add to main index, hooks, landing-blocks, and store features
// UI components have their own directives in source, but bundled output needs top-level directive
const filesToModify = [
  'index.js',
  'index.mjs',
  'hooks/index.js',
  'hooks/index.mjs',
  'features/seo/index.js',
  'features/seo/index.mjs',
  'features/landing-blocks/index.js',
  'features/landing-blocks/index.mjs',
  'features/store/index.js',
  'features/store/index.mjs',
];

filesToModify.forEach((file) => {
  const filePath = path.join(distPath, file);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if 'use client' already exists
    if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
      const newContent = `"use client";\n${content}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Added 'use client' to ${file}`);
    } else {
      console.log(`✓ ${file} already has 'use client'`);
    }
  } else {
    console.log(`⚠ ${file} not found, skipping`);
  }
});

console.log('\n✨ Done adding use client directives!');
