/* eslint-disable no-console */
import path from 'node:path'
import fs from 'node:fs/promises'
import { spawnSync } from 'child_process'
import prompts from 'prompts'

import version from '../version.json'
import packageJson from '../package.json'

const androidManifestPath = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
)

const preBuild = async () => {
  const currentVersionName = version.android.versionName

  let [major, feature, patch] = currentVersionName
    .split('.')
    .map(value => parseInt(value))

  const { buildType }: { buildType: 'major' | 'feature' | 'patch' } =
    await prompts({
      name: 'buildType',
      message: 'Select the update type',
      type: 'select',
      choices: [
        { title: 'Major', value: 'major', selected: false },
        { title: 'Feature', value: 'feature', selected: true },
        { title: 'Patch', value: 'patch', selected: false }
      ]
    })

  if (buildType === 'patch') {
    patch += 1
  } else if (buildType === 'feature') {
    feature += 1
    patch = 0
  } else if (buildType === 'major') {
    major += 1
    feature = 0
    patch = 0
  }

  const updatedVersionName = `${major}.${feature}.${patch}`
  const updatedVersionCode = version.android.versionCode + 1
  const updatedVersion = {
    android: {
      versionCode: updatedVersionCode,
      versionName: updatedVersionName
    }
  }
  const updatedPackageJsonObj = {
    ...packageJson,
    version: updatedVersionName
  }

  const updatedJson = JSON.stringify(updatedVersion, null, 2)
  const updatedPackageJson = JSON.stringify(updatedPackageJsonObj, null, 2)

  const { correctVersionName }: { correctVersionName: boolean } = await prompts(
    {
      name: 'correctVersionName',
      type: 'confirm',
      message: `The version name will be updated to ${updatedVersionName}. Is it correct?`,
      initial: true
    }
  )

  if (!correctVersionName) return console.log('Build cancelled!')

  await fs.writeFile(path.resolve(__dirname, '..', 'version.json'), updatedJson)
  await fs.writeFile(
    path.resolve(__dirname, '..', 'package.json'),
    updatedPackageJson
  )

  const currentAndroidManifestLine = `<meta-data android:name="expo.modules.updates.EXPO_RELEASE_CHANNEL" android:value="${currentVersionName}" />`
  const newAndroidManifestLine = `<meta-data android:name="expo.modules.updates.EXPO_RELEASE_CHANNEL" android:value="${updatedVersionName}" />`
  const androidManifest = (await fs.readFile(androidManifestPath)).toString()
  const updatedAndroidManifest = androidManifest.replace(
    currentAndroidManifestLine,
    newAndroidManifestLine
  )

  await fs.writeFile(androidManifestPath, updatedAndroidManifest)

  console.log('Updated version!')

  spawnSync('git', ['add', '.'], {})
  spawnSync('git', ['commit', '-m', `🔖 release ${updatedVersionName}`])
}

preBuild()
