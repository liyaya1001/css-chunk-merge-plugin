/**
 * MergeChunkCssPlugin
 * 将指定 chunk 的 CSS 合并到主 CSS 文件中
 */
class MergeChunkCssPlugin {
  constructor(options = {}) {
    // 要合并 CSS 的 chunk 名称列表
    this.chunks = options.chunks || []
    this.pluginName = 'MergeChunkCssPlugin'
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: this.pluginName,
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        (assets) => {
          // 找到主 CSS 文件 (app.xxx.css)
          let mainCssName = null
          let mainCssContent = ''

          for (const name of Object.keys(assets)) {
            if (name.match(/^css\/app\.[^.]+\.css$/)) {
              mainCssName = name
              mainCssContent = assets[name].source()
              break
            }
          }

          if (!mainCssName) {
            console.warn(`[${this.pluginName}] 未找到主 CSS 文件`)
            return
          }

          // 收集要合并的 CSS
          const cssToMerge = []
          const cssFilesToRemove = []

          for (const chunkName of this.chunks) {
            for (const name of Object.keys(assets)) {
              // 匹配 chunk 对应的 CSS 文件 (css/chunkName.xxx.css)
              const pattern = new RegExp(`^css/${chunkName}\\.[^.]+\\.css$`)
              if (pattern.test(name)) {
                const content = assets[name].source()
                cssToMerge.push(`/* === ${chunkName} === */\n${content}`)
                cssFilesToRemove.push(name)
                console.log(`[${this.pluginName}] 合并 CSS: ${name} -> ${mainCssName}`)
              }
            }
          }

          if (cssToMerge.length === 0) {
            console.warn(`[${this.pluginName}] 未找到需要合并的 CSS 文件`)
            return
          }

          // 合并 CSS 到主文件
          const mergedContent = mainCssContent + '\n' + cssToMerge.join('\n')

          // 更新主 CSS 文件
          compilation.updateAsset(mainCssName, new compiler.webpack.sources.RawSource(mergedContent))

          // 保留原 CSS 文件但清空内容（避免 404，代码运行时会请求这些文件）
          for (const name of cssFilesToRemove) {
            const chunkName = name.replace(/^css\/([^.]+)\..+\.css$/, '$1')
            compilation.updateAsset(name, new compiler.webpack.sources.RawSource(`/* ${chunkName} merged to app.css */`))
          }

          console.log(`[${this.pluginName}] 完成，已合并 ${cssToMerge.length} 个 CSS 文件`)
        }
      )
    })
  }
}

module.exports = MergeChunkCssPlugin
