import { IssueType } from './Issue';

const FIVE_MIN_MILLISEC = 5 * 60 * 1000;

const makeSampleIssueWithTime = (date: Date): IssueType => {
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

const makeDaySampleIssues = (): IssueType[] => {
  const issues: IssueType[] = [];
  const now = new Date();
  for (let i = 0; i < 300; i += 1) {
    const newDate = new Date(now.getTime() - FIVE_MIN_MILLISEC * i);
    const newIssue: IssueType = makeSampleIssueWithTime(newDate);
    issues.push(newIssue);
  }
  return issues;
};

export default makeDaySampleIssues;
