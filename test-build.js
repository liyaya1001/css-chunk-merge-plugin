// test-build.js
const CssChunkMergePlugin = require('./dist/index.cjs.js')

console.log('插件类型:', typeof CssChunkMergePlugin)
console.log('插件构造函数:', CssChunkMergePlugin)

// 验证插件可以实例化
const plugin = new CssChunkMergePlugin()
console.log('插件实例创建成功:', plugin)
