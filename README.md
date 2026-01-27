## ✨ Features

- ⏱ **css auto merge** - Automatically merge css chunk to main.css.

## 📦 Installation

```bash
npm install css-chunk-merge-plugin --save-dev
# or
yarn add css-chunk-merge-plugin -D
# or
pnpm install css-chunk-merge-plugin --save-dev
```

## 🚀 Quick Start

```javascript
// webpack.config.js
const CssChunkMergePlugin = require('css-chunk-merge-plugin')
module.exports = {
  plugins: [
    new CssChunkMergePlugin({
      chunks: ['monitor'],
    }),
  ],
}
```

## 🐛 Issues

If you encounter any issues or have suggestions for improvements, please click here [Issue Report](https://github.com/liyaya1001/css-chunk-merge-plugin/issues)

## 📄 License

[MIT](https://github.com/liyaya1001/css-chunk-merge-plugin/blob/main/LICENSE)

Copyright (c) 2026-present yayali
