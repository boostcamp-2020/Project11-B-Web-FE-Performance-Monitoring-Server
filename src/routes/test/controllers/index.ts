import filenames from '../../../utils/filenames';

const controllerNames = filenames(__dirname);

const controllerModules: any = {};

controllerNames.map((controllerName) => {
  controllerModules[controllerName] = require(`./${controllerName}`);
});

module.exports = controllerModules;
