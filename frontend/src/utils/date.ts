import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const mapDOMDateToUTC = (date: string) => {
  return dayjs(date).utc().format();
};

export const mapUTCToDOMDate = (utc: string) => {
  return dayjs(utc).format('YYYY-MM-DD');
};
