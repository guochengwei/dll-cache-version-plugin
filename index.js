const path = require('path');

class ServiceWorkerPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    if (compiler.hooks) {
      // webpack4.x API
      compiler.hooks.emit.tapAsync('DllCacheVersionPlugins', (compilation, cb) => {
        const outputPath = path.join(compiler.options.output.path, './dllCacheVersion.json');
        let version;
        if (this.options.chunkHash) {
          version = compilation.chunks.reduce((obj, chunk) => {
            obj[chunk.name] = chunk.hash;
            return obj;
          }, {});
        } else {
          version = compilation.hash;
        }
        const json = JSON.stringify({
          dllCacheVersion: version
        });
        compiler.outputFileSystem.writeFile(outputPath, Buffer.from(json, 'utf8'), cb);
      });
    } else {
      throw new Error('plugins requires webpack >=4.x. Please upgrade your webpack version.');
    }
  }
}

module.exports = ServiceWorkerPlugin;