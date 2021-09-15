import moment from 'moment';
export const getSalesReportYear = () => {
  const current = moment();
  const currentYear = current.year();
  const startReport = moment(`${currentYear}-10-01T00:00:00-07:00`);
  const endReport = moment(`${currentYear + 1}-01-15T23:59:59-07:00`);
  const prevStartReport = moment(`${currentYear - 1}-10-01T00:00:00-07:00`);
  const prevEndReport = moment(`${currentYear}-01-15T23:59:59-07:00`);

  let year = 0;
  let isAbleToEdit = false;

  if (current.isBefore(startReport)) {
    year = current.year() - 1;
    if (current.isBefore(prevEndReport)) {
      isAbleToEdit = true;
    }
  } else {
    year = current.year();
    isAbleToEdit = true;
  }
  return { year, isAbleToEdit };
};
