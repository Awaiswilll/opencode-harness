export const name = "opencode-harness"
export const version = "2.0.0-rc.1"
export const description = "80+ agents, 260+ skills, 35+ commands for OpenCode"

export default async function opencodeHarnessPlugin() {
  return {
    name,
    version,
    description,
    tools: {},
    hooks: {},
  }
}
