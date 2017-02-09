#! /usr/bin/env node
import Promise        from 'bluebird';
import fs             from 'fs';

const promisify       = Promise.promisify;
const outputDir       = 'converted/';
const delimiter       = new Buffer([0xff, 0xd8]);

class GTASnapmaticConverter {
  constructor() {
    if(process.argv.length <= 2) {
      console.log(`Usage:  ${__filename} <directory>`);
      process.exit(-1);
    }
    this.convert(process.argv[2] + '/')
      .then(() => {
        console.log('done');
      })
  }

  convert = async (filesDir) => {
    await this.createDirectory(filesDir + outputDir);
    let files = await this.getFilesToConvert(filesDir);
    for(let filename of files) {
      let convertedFile = await this.convertToJpg(
        await this.readFile(filesDir + filename));

      let savedFile = await this.saveFile(convertedFile,
        filesDir, filename.split('.').pop() + '.jpg');

      console.log('converted file: ' + savedFile);
    }
  };

  convertToJpg(file) {
    return file.slice(file.indexOf(delimiter), file.length);
  }

  saveFile(data, dir, filename) {
    let outputFile = dir + outputDir + filename;
    return promisify(fs.writeFile)(outputFile, data)
      .then(() => { return outputFile; });
  }

  readFile(filename) {
    return promisify(fs.readFile)(filename)
      .then((data) => { return data; })
  }

  createDirectory(dir) {
    return promisify(fs.stat)(dir)
      .then(null)
      .catch(err => {
        if(err.code == 'ENOENT')
          return promisify(fs.mkdir)(dir);
      });
  }

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
}

new GTASnapmaticConverter();
