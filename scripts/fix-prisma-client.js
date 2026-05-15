import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, lstatSync, mkdirSync, readdirSync, renameSync, symlinkSync, unlinkSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function resolveProjectRoot(startDir) {
  let dir = startDir
  for (let i = 0; i < 10 && dir; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir
    dir = join(dir, '..')
  }
  return process.cwd()
}

const here = __dirname
const npmRoot = resolveProjectRoot(here)
const clientLibDir = join(npmRoot, 'node_modules', '@prisma', 'client')
const sourceDir = join(npmRoot, 'node_modules', '.prisma', 'client')
const linkDir = join(clientLibDir, '.prisma', 'client')

try {
  if (!existsSync(sourceDir)) {
    // prisma generate hasn't produced its output yet; skip gracefully
    process.exit(0)
  }

  if (existsSync(linkDir)) {
    const st = lstatSync(linkDir)
    if (!st.isSymbolicLink()) {
      process.exit(0) // real dir already there – nothing to fix
    }
    // Symlink exists: check it points to the right target
    try {
      const targetSnapshot = readdirSync(linkDir)
      if (targetSnapshot.length) process.exit(0) // already valid
    } catch {
      // stale or wrong target – recreate below
    }
  }

  // Ensure parent exists:  node_modules/@prisma/client/.prisma
  mkdirSync(join(clientLibDir, '.prisma'), { recursive: true })

  // Atomically replace the symlink in one fs call to avoid npm/cache conflicts
  const tmp = join(clientLibDir, '.prisma', '_new_link')
  try { unlinkSync(tmp) } catch {}
  symlinkSync(sourceDir, tmp, 'dir')
  renameSync(tmp, linkDir)
} catch {
  // best-effort only – never block production installs
}
