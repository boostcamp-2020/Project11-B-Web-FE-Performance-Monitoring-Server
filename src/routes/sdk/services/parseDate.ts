interface PrarsedDate {
  year: number;
  month: number;
  date: number;
}

const parseDate = (dateObj: Date): PrarsedDate => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  return { year, month, date };
};
export default parseDate;
