#!/usr/bin/env node
/**
 * opencode-harness — Quick Install
 * Symlinks agents/skills into your OpenCode config directory.
 *
 * Usage:
 *   npx opencode-harness-install
 *   npx opencode-harness-install ~/.config/opencode
 */

import { existsSync, symlinkSync, readlinkSync, unlinkSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HARNESS = join(__dirname, '..')
const TARGET = resolve(process.argv[2] || join(process.env.HOME, '.config', 'opencode'))

const links = [
  { name: 'agents', src: join(HARNESS, 'agents'), dst: join(TARGET, 'agents') },
  { name: 'skills', src: join(HARNESS, 'skills'), dst: join(TARGET, 'skills') },
]

console.log(`Linking opencode-harness → ${TARGET}`)

if (!existsSync(TARGET)) {
  console.error(`Error: Target ${TARGET} does not exist.`)
  process.exit(1)
}

for (const { name, src, dst } of links) {
  if (!existsSync(src)) {
    console.warn(`  ! ${name} source missing at ${src} — skipping`)
    continue
  }
  if (existsSync(dst)) {
    try {
      const existing = readlinkSync(dst)
      if (existing === src) {
        console.log(`  ✓ ${name} already linked`)
        continue
      }
      console.log(`  ~ ${name} exists (link: ${existing}) — replacing`)
      unlinkSync(dst)
    } catch {
      console.log(`  ~ ${name} exists (not a symlink) — skipping`)
      continue
    }
  }
  symlinkSync(src, dst, 'junction')
  console.log(`  ✓ Linked ${name}`)
}

console.log('\nDone! Add to your opencode.jsonc:\n')
console.log('  "skills": { "paths": ["' + join(TARGET, 'skills') + '"] }')
