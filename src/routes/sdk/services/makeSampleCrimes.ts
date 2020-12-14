import { ICrime } from '../../../models/Crime';

const messages = [
  'Unhandled Promise Rejection',
  "Cannot set property 'innerHTML' of null",
  'notDefined is not defined',
];
const types = ['Error', 'TypeError', 'ReferenceError'];
const stacks = [
  {
    columnNo: '81',
    lineNo: '110',
    function: 'occurError()',
    filename: 'index.js',
  },
  {
    columnNo: '9',
    lineNo: '111',
    function: 'occurError()',
    filename: 'errorTest.js',
  },
  {
    columnNo: '10',
    lineNo: '112',
    function: 'occurError()',
    filename: 'errorTest.js',
  },
];
const sdk = {
  name: 'panopticon',
  version: '2.0.0',
};
const browsers = [
  {
    name: 'Chrome',
    version: '87.0.4280.88',
  },
  {
    name: 'Microsoft Edge',
    version: '87.0.664.60',
  },
  {
    name: 'Internet Explorer',
    version: '11',
  },
];
const oss = [
  {
    name: 'Windows',
    version: '10',
  },
  {
    name: 'Android',
    version: 'Lollipop',
  },
  {
    name: 'macOS',
    version: '10.15',
  },
];
const urls = [
  'http://sample-app.com/',
  'http://sample-app.com/users',
  'http://sample-app.com/samplers',
];

const randomInt = (start: number, end: number) => {
  return start + Math.floor(Math.random() * (end + 1 - start));
};

const pickRandom = (arr: any[]) => {
  const randomIndex = randomInt(0, arr.length - 1);
  return arr[randomIndex];
};

const WEEK_MILLISEC = 1000 * 60 * 60 * 24 * 7;

const randomDate = (period = '1w') => {
  return new Date(Date.now() - randomInt(0, WEEK_MILLISEC));
};

const makeSample = (): ICrime => {
  return {
    message: pickRandom(messages),
    type: pickRandom(types),
    stack: stacks,
    occuredAt: randomDate(),
    projectId: '',
    sdk,
    meta: {
      browser: pickRandom(browsers),
      os: pickRandom(oss),
      url: pickRandom(urls),
      ip: '',
    },
  };
};

const makeSamples = (count: number): ICrime[] => {
  return new Array(count).fill(0).map(makeSample);
};

export default makeSamples;
