import { IError } from './Error';

const HOUR_MILLISEC = 60 * 60 * 1000;

const makeSampleIssueWithTime = (date: Date): IError => {
  const newSample = {
    sdk: {
      name: 'pan-opt',
      version: '1.0.0',
    },
    meta: {
      browser: {
        name: 'Chrome',
        version: '87.0.4280.66',
      },
      os: {
        name: 'Windows',
        version: '10',
      },
      url: 'http://localhost:9000/',
      ip: 'localhost:3000',
    },
    message: 'error maker made this',
    type: 'sample type',
    stack: [
      {
        columnNo: '9',
        lineNo: '8',
        filename: 'webpack:///./src/index.js?',
        function: 'errorMaker',
      },
      {
        columnNo: '5',
        lineNo: '15',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
      {
        columnNo: '5',
        lineNo: '13',
        filename: 'webpack:///./src/index.js?',
        function: 'errorCountdown',
      },
    ],
    occuredAt: date,
  };
  return newSample;
};

const makeDaySampleIssues = (): IError[] => {
  const issues: IError[] = [];
  const now = new Date();
  for (let i = 1; i <= 24; i += 1) {
    const errorNumPerHour: number = Math.floor(Math.random() * 20) + 1;
    for (let j = 0; j < errorNumPerHour; j += 1) {
      const newDate = new Date(
        now.getTime() - HOUR_MILLISEC * i + Math.floor(Math.random()) * HOUR_MILLISEC,
      );
      const newIssue: IError = makeSampleIssueWithTime(newDate);
      issues.push(newIssue);
    }
  }
  return issues;
};

export default makeDaySampleIssues;
