#!/usr/bin/env bun

import { rootNodeFromAnchor } from '@codama/nodes-from-anchor';
import { renderVisitor } from '@codama/renderers-js';
import { visit } from '@codama/visitors-core';
import { resolve } from 'path';
import idls from '../src/constants/idls';

interface GenerateOptions {
  idlName?: string;
  all?: boolean;
}

async function generateClient(options: GenerateOptions = {}) {
  const { idlName, all = false } = options;
  
  // Determine which IDLs to generate
  const idlsToGenerate = all 
    ? Object.entries(idls)
    : idlName 
      ? [[idlName, idls[idlName as keyof typeof idls]]]
      : Object.entries(idls);

  if (!idlsToGenerate.length) {
    console.error('❌ No IDLs found to generate');
    process.exit(1);
  }

  for (const [name, idl] of idlsToGenerate) {
    if (!idl) {
      console.warn(`⚠️  IDL "${name}" not found, skipping...`);
      continue;
    }

    console.log(`🔧 Generating Codama client for ${name}...`);

    try {
      // Convert Anchor IDL to Codama root node
      const rootNode = rootNodeFromAnchor(idl as any);

      // Create the JavaScript/TypeScript renderer for this specific IDL
      const outputPath = resolve(__dirname, '../src/generated', name);
      const visitor = renderVisitor(outputPath, {
        renderParentInstructions: true,
      });

      // Generate the client code
      await visit(rootNode, visitor as any);

      console.log(`✅ Successfully generated Codama client for ${name} in src/generated/${name}/`);
    } catch (error) {
      console.error(`❌ Failed to generate client for ${name}:`, error);
      process.exit(1);
    }
  }

  console.log('🎉 All clients generated successfully in src/generated/');
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: GenerateOptions = {};

if (args.includes('--all')) {
  options.all = true;
} else if (args.length > 0 && !args[0].startsWith('--')) {
  options.idlName = args[0];
} else {
  // Default to generating all if no specific IDL is provided
  options.all = true;
}

// Run the generator
generateClient(options);
