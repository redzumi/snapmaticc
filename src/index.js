#! /usr/bin/env node
import Promise        from 'bluebird';
import fs             from 'fs';

const promisify       = Promise.promisify;
const outputDir       = 'converted/';

class GTASnapmaticConverter {

  constructor() {
    if(process.argv.length <= 2) {
      console.log(`Usage:  ${__filename} <directory>`);
      process.exit(-1);
    }
    this.convert(process.argv[2] + '/');
  }

  convert = async (filesDir) => {
    await this.createDirectory(filesDir + outputDir);
    let files = await this.getFilesToConvert(filesDir);
    for(let file of files) {
      let convertedFile = await this.convertToJpg(
        filesDir + file,
        filesDir + outputDir + file.split('.').pop() + '.jpg'
      );
      console.log('converted file: ' + convertedFile);
    }
  };

  getFilesToConvert(dir) {
    return promisify(fs.readdir)(dir)
      .then((files) => {
        let foundFiles = [];
        for(let file of files) {
          if(file.startsWith('PGTA')) foundFiles.push(file);
        }
        return foundFiles;
      })
  }

  convertToJpg(inputFile, outputFile) {
    return promisify(fs.readFile)(inputFile, 'hex')
      .then((data) => { return this.saveJpg(outputFile, data) })
  }

  saveJpg(outputFile, data) {
    return promisify(fs.writeFile)(
      outputFile,
      data.replace(data.split('ffd8')[0], ''), 'hex')
      .then(() => { return outputFile; });
  }

  createDirectory(dir) {
    return promisify(fs.stat)(dir)
      .then(null)
      .catch(err => {
        if(err.code == 'ENOENT')
          return promisify(fs.mkdir)(dir);
      });
  }

}

new GTASnapmaticConverter();
