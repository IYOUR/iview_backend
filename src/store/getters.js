import DateFormat from '../commons/utils/formatDate.js';

export default {
    
    exportCSVdate: state => {
      let date = state.queryParam.pastWeek.param,
          sdate = DateFormat.format(DateFormat.formatToDate(date.sdate), 'MM-dd'),
          edate = DateFormat.format(DateFormat.formatToDate(date.edate), 'MM-dd')
      return `${sdate}_${edate}`;
    }
}
