const randomStr = (): string => {
  return Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2);
};

export default randomStr;
