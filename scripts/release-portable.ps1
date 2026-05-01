$ErrorActionPreference = "Stop"

Write-Host "[release-portable] unit tests"
npm run test:unit

Write-Host "[release-portable] e2e tests"
npm run test:e2e

Write-Host "[release-portable] tauri portable build"
npm run tauri:build:portable

Write-Host "[release-portable] output: src-tauri/target/release/music-player.exe"
