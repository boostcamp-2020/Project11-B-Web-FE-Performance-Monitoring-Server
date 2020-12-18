const getPeriodLabel = (period: string): string => {
  switch (period) {
    case '1d':
      return '1일';
    case '3d':
      return '3일';
    case '1w':
      return '1주일';
    default:
      return period;
  }
};

export default getPeriodLabel;
