// mixins/dateFilterMixin.js
import moment from 'moment';

export default {
  methods: {
    filterByDate(data, selectedFilter) {
      const now = moment();

      return data.filter(item => {
        const itemDate = moment(item.date);
        
        if (!itemDate.isValid()) {
          console.error('Invalid Date:', item.date);
          return false;
        }
        
        switch (selectedFilter) {
          case 'today':
            return itemDate.isSame(now, 'day');
          case 'yesterday':
            return itemDate.isSame(now.clone().subtract(1, 'days'), 'day');
          case 'lastWeak': {
            const startOfWeek = now.clone().subtract(7, 'days').startOf('day');
            const endOfWeek = now.clone().endOf('day');
            return itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
          }
          case 'lastMonth': {
            const startOfThisMonth = now.clone().startOf('month');
            const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month');
            return itemDate.isBetween(startOfLastMonth, startOfThisMonth, null, '[]');
          }
          case 'lastYear':
            return itemDate.isBetween(now.clone().subtract(1, 'year'), now, null, '[]');
          case 'all':
          default:
            return true;
        }
      });
    }
  }
};






