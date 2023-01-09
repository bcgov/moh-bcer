import moment from 'moment';
import { ConfigDates } from 'src/utils/configDates';
export const getSalesReportYear = () => {
  const current = moment();
  const currentYear = current.year();
  const startReport = moment(`${currentYear}-${ConfigDates.salesReportStart}T00:00:00-07:00`);
  const endReport = moment(`${currentYear + 1}-${ConfigDates.salesReportEnd}T23:59:59-07:00`);
  const prevStartReport = moment(`${currentYear - 1}-${ConfigDates.salesReportStart}T00:00:00-07:00`);
  const prevEndReport = moment(`${currentYear}-${ConfigDates.salesReportEnd}T23:59:59-07:00`);

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

export const getSalesReportingPeriod = () => {
  const current = moment();
  const currentYear = current.year();
  const startReport = moment(`${currentYear - 1}-${ConfigDates.salesReportStart}`);
  const endReport = moment(`${currentYear}-${ConfigDates.salesReportEnd}T23:59:59-07:00`);

  if(current.isAfter(endReport)){
    startReport.add(1, 'year');
    endReport.add(1, 'year');
  }

  return { startReport, endReport};
}

export const getNoiReportingPeriod = () => {
  const current = moment();
  const currentYear = current.year();
  const startReport = moment(`${currentYear - 1}-10-01`);
  const endReport = moment(`${currentYear}-01-15T23:59:59-07:00`);

  if(current.isAfter(endReport)){
    startReport.add(1, 'year');
    endReport.add(1, 'year');
  }

  return { startReport, endReport};
}