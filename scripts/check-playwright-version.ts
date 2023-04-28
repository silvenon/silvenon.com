import pkg from '@playwright/test/package.json'
import fs from 'fs/promises'
import assert from 'assert'

async function checkPlaywrightVersion() {
  const workflow = await fs.readFile(
    `${__dirname}/../.github/workflows/deploy.yml`,
    'utf8',
  )
  assert(
    workflow.includes(`playwright:v${pkg.version}`),
    `Playwright version mismatch on CI, should be v${pkg.version}`,
  )
}

checkPlaywrightVersion()
