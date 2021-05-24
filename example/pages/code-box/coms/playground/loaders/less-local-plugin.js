import less from 'less';

class LocalFileManager extends less.FileManager {
  constructor(files) {
    super();
    this.files = files;
  }

  supports(filename) {
    return ['theme.less'].includes(filename) || filename.startsWith('./');
  }

  /**
     * Sync checker whether file is to be processed by plugin.
     *
     * @param {string} filename
     * @param {string} currentDirectory
     * @param {object} options
     * @param environment
     * @returns {boolean}
     */
  supportsSync(filename, currentDirectory, options, environment) {
    return this.supports(filename, currentDirectory, options, environment);
  }

  /**
     * Loads file asynchronously.
     *
     * @param {string} filename
     * @param {string} currentDirectory
     * @param options
     * @param environment
     * @param callback
     * @returns {*|Promise}
     */
  loadFile(filename) {
    return Promise.resolve(this.loadFileSync(filename));
  }

  loadFileSync(filename) {
    const file = this.files.find(f => f.filename === filename);
    return {
      filename: filename,
      contents: file.code
    };
  }
}


class LocalFileManagerPlugin {
  constructor(files) {
    this.files = files;
    this.minVersion = [2, 0, 0];
  }

  install(less, pluginManager) {
    pluginManager.addFileManager(
      new LocalFileManager(this.files)
    );
  }
}

export default LocalFileManagerPlugin;


