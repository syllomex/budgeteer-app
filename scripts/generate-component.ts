import fs from 'fs'
import path from 'path'

const indexOfFirstArg = process.argv.indexOf('--')
const args = process.argv.filter((_arg, index) => index >= indexOfFirstArg)

const component = args[args.indexOf('--name') + 1]
const type = args[args.indexOf('--type') + 1]

if (!component) throw new Error('No --name specified')
if (!type) throw new Error('No --type specified')
if (type !== 'component' && type !== 'screen') {
  throw new Error('--type must be "component" or "screen"')
}

const componentsFolder = [__dirname, '..', 'src', 'components']
const screensFolder = [__dirname, '..', 'src', 'screens']

const dir = type === 'component' ? componentsFolder : screensFolder

fs.mkdirSync(path.join(...dir, component))
fs.writeFileSync(path.join(...dir, component, 'index.tsx'), [].join())
fs.writeFileSync(path.join(...dir, component, 'styles.ts'), [].join())
