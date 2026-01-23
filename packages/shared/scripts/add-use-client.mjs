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
const filesToModify = [
  'ui/index.js',
  'ui/index.mjs',
  'hooks/index.js',
  'hooks/index.mjs',
  'index.js',
  'index.mjs',
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
