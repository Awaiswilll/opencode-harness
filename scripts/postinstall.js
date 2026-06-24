#!/usr/bin/env node
/**
 * opencode-harness — Postinstall Script
 * Auto-links agents and skills when installed globally.
 */

import { existsSync, symlinkSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HARNESS_ROOT = join(__dirname, '..')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((r) => rl.question(q, r))

const OPTS = {
  '~/.config/opencode': {
    label: 'Global OpenCode config (recommended)',
    agents: 'agents',
    skills: 'skills',
  },
  '.opencode': {
    label: 'Project-level .opencode/',
    agents: '../agents',
    skills: '../skills',
  },
}

async function linkHarness(targetDir, { agents, skills }) {
  const absTarget = targetDir.replace(/^~/, process.env.HOME)
  const absHarness = HARNESS_ROOT

  if (!existsSync(absTarget)) {
    console.log(`  ✗ ${absTarget} not found — skipping`)
    return
  }

  // Link agents
  const agentTarget = join(absTarget, agents === 'agents' ? 'agents' : agents)
  const agentSource = join(absHarness, 'agents')
  if (!existsSync(agentTarget)) {
    try {
      symlinkSync(agentSource, agentTarget, 'junction')
      console.log(`  ✓ Linked agents → ${agentTarget}`)
    } catch (e) {
      console.log(`  ! Could not link agents: ${e.message}`)
    }
  } else {
    console.log(`  ~ agents already exists at ${agentTarget}`)
  }

  // Link skills
  const skillTarget = join(absTarget, skills === 'skills' ? 'skills' : skills)
  const skillSource = join(absHarness, 'skills')
  if (!existsSync(skillTarget)) {
    try {
      symlinkSync(skillSource, skillTarget, 'junction')
      console.log(`  ✓ Linked skills → ${skillTarget}`)
    } catch (e) {
      console.log(`  ! Could not link skills: ${e.message}`)
    }
  } else {
    console.log(`  ~ skills already exists at ${skillTarget}`)
  }

  // Copy config files
  const configDir = join(absHarness, 'config')
  const configTargets = ['commands', 'prompts', 'instructions', 'mcp-servers.json', 'opencode.jsonc', 'AGENTS.md']
  for (const item of configTargets) {
    const src = join(configDir, item)
    const dest = join(absTarget, item)
    if (existsSync(src) && !existsSync(dest)) {
      try {
        if (item.endsWith('.json') || item.endsWith('.md')) {
          copyFileSync(src, dest)
          console.log(`  ✓ Copied ${item} → ${dest}`)
        }
      } catch (e) {
        console.log(`  ! Could not copy ${item}: ${e.message}`)
      }
    }
  }
}

async function main() {
  console.log('\n=== opencode-harness Setup ===\n')

  // Auto-detect: try global config first
  const globalDir = join(process.env.HOME, '.config', 'opencode')
  if (existsSync(globalDir)) {
    console.log('Found OpenCode config at ~/.config/opencode/')
    const answer = await ask('Link harness to global config? [Y/n] ')
    if (!answer || answer.toLowerCase() === 'y' || answer === '') {
      await linkHarness('~/.config/opencode', OPTS['~/.config/opencode'])
    }
  }

  // Also check for project-level .opencode/
  const cwd = process.cwd()
  const projectDir = join(cwd, '.opencode')
  if (existsSync(projectDir)) {
    console.log(`\nFound project config at ${projectDir}/`)
    const answer = await ask('Link harness to this project? [y/N] ')
    if (answer && answer.toLowerCase() === 'y') {
      await linkHarness(projectDir, OPTS['.opencode'])
    }
  }

  // Check for other common locations
  console.log('\n---\n')
  console.log('To link manually:')
  console.log('  npx opencode-harness-link <target-dir>')
  console.log('')
  console.log('Or symlink directly:')
  console.log('  ln -s $(pwd)/agents ~/.config/opencode/agents')
  console.log('  ln -s $(pwd)/skills ~/.config/opencode/skills')
  console.log('')

  rl.close()
}

main().catch(console.error)
