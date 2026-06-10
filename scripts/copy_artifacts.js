import { readdirSync, existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const targetDir = join(projectRoot, 'src-tauri', 'target')
const androidBuildDir = join(projectRoot, 'src-cap', 'android', 'app', 'build', 'outputs')
const destDir = join(projectRoot, 'build', 'apps')
const appBase = 'Picoder'
const allowedExtensions = ['.apk', '.exe', '.dmg']

function getAppVersion() {
  try {
    return JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8')).version || '1.0.0'
  } catch {
    return '1.0.0'
  }
}

function getArchFromTargetTriple(targetTriple) {
  if (targetTriple.includes('x86_64')) return 'x64'
  if (targetTriple.includes('i686')) return 'x86'
  if (targetTriple.includes('aarch64')) return 'aarch64'
  if (targetTriple.includes('armv7')) return 'armv7'
  return targetTriple.split('-')[0] || 'unknown'
}

function getAllFiles(dir, fileList = []) {
  if (!existsSync(dir)) return fileList
  for (const file of readdirSync(dir)) {
    const filePath = join(dir, file)
    statSync(filePath).isDirectory() ? getAllFiles(filePath, fileList) : fileList.push(filePath)
  }
  return fileList
}

function ensureDest() {
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
}

function copyArtifactsFromPath(targetTriple, buildType) {
  const bundleDir = join(targetDir, targetTriple, buildType, 'bundle')
  if (!existsSync(bundleDir)) {
    console.log(`Bundle directory not found: ${bundleDir}`)
    return 0
  }

  ensureDest()
  const version = getAppVersion()
  const arch = getArchFromTargetTriple(targetTriple)
  let copied = 0

  for (const filePath of getAllFiles(bundleDir)) {
    const ext = extname(filePath)
    if (!allowedExtensions.includes(ext)) continue

    const suffix = buildType === 'debug' ? `_debug${ext}` : ext
    const destFileName = `${appBase}_${version}_${arch}${suffix}`
    copyFileSync(filePath, join(destDir, destFileName))
    console.log(`✓ Copied ${basename(filePath)} → build/apps/${destFileName}`)
    copied++
  }

  return copied
}

function copyAndroidArtifacts(buildType) {
  ensureDest()
  const version = getAppVersion()
  let copied = 0

  for (const dirType of ['apk', 'bundle']) {
    const outputDir = join(androidBuildDir, dirType, buildType)
    for (const filePath of getAllFiles(outputDir)) {
      const fileName = basename(filePath)
      const ext = extname(fileName)
      if (!allowedExtensions.includes(ext) || fileName.includes('unsigned')) continue

      const destFileName = buildType === 'debug' ? `${appBase}_${version}_cap_debug.apk` : `${appBase}_${version}_cap.apk`
      copyFileSync(filePath, join(destDir, destFileName))
      console.log(`✓ Copied ${fileName} → build/apps/${destFileName}`)
      copied++
    }
  }

  return copied
}

function findAndCopyArtifacts() {
  const [targetTriple, buildType] = process.argv.slice(2)
  if (targetTriple && buildType) {
    const copied = targetTriple === 'android' ? copyAndroidArtifacts(buildType) : copyArtifactsFromPath(targetTriple, buildType)
    console.log(copied ? `\n✨ ${copied} file(s) copied to build/apps/` : 'No build files found.')
    return
  }

  if (!existsSync(targetDir)) {
    console.log('Target directory not found. Build may not have completed.')
    return
  }

  let totalCopied = 0
  for (const triple of readdirSync(targetDir).filter((item) => statSync(join(targetDir, item)).isDirectory() && !['debug', 'release'].includes(item))) {
    totalCopied += copyArtifactsFromPath(triple, 'debug')
    totalCopied += copyArtifactsFromPath(triple, 'release')
  }
  console.log(totalCopied ? `\n✨ ${totalCopied} file(s) copied to build/apps/` : 'No bundle files found in target directory.')
}

findAndCopyArtifacts()
