const path = require('path');

class DllCacheVersionPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    if (compiler.hooks) {
      // webpack4.x API
      compiler.hooks.emit.tapAsync('DllCacheVersionPlugin', (compilation, cb) => {
        const outputPath = path.join(compiler.options.output.path, './dllCacheVersion.json');
        let version;
        if (this.options.chunkHash) {
          version = JSON.stringify(compilation.chunks.reduce((obj, chunk) => {
            obj[chunk.name] = chunk.hash;
            return obj;
          }, {}));
          version = version.slice(0, version.length);
        } else {
          version = compilation.hash;
        }
        compiler.outputFileSystem.writeFile(outputPath, Buffer.from('{ "dllCacheVersion": ' + version + ' }', 'utf8'), cb);
      });
    } else {
      throw new Error('plugins requires webpack >=4.x. Please upgrade your webpack version.');
    }
  }
}

module.exports = DllCacheVersionPlugin;