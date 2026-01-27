import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

async function build() {
  console.log('🚀 开始构建...')

  // 清理 dist 目录
  await fs.remove('dist')

  // 运行 Rollup
  execSync('rollup -c', { stdio: 'inherit' })

  // 复制 README.md 和 LICENSE
  await fs.copy('README.md', 'dist/README.md')
  if (fs.existsSync('LICENSE')) {
    await fs.copy('LICENSE', 'dist/LICENSE')
  }

  // 复制 package.json（排除 devDependencies）
  const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'))
  const publishPkg = {
    ...pkg,
    scripts: undefined,
    devDependencies: undefined,
    husky: undefined,
    'lint-staged': undefined,
    // 保留必要的字段
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: 'index.cjs.js',
    module: 'index.esm.js',
    browser: 'index.umd.js',
    types: 'types/index.d.ts',
    files: ['*.js', '*.d.ts', 'types/'],
    peerDependencies: pkg.peerDependencies,
    dependencies: pkg.dependencies,
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
  }

  await fs.writeFile('dist/package.json', JSON.stringify(publishPkg, null, 2))

  console.log('✅ 构建完成！')
}

build().catch(console.error)
