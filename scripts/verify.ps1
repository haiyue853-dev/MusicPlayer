$ErrorActionPreference = "Stop"

Write-Host "[verify] unit tests"
npm run test:unit

Write-Host "[verify] e2e tests"
npm run test:e2e

Write-Host "[verify] tauri build"
npm run tauri:build

Write-Host "[verify] done"
