export default {
  methods: {
    getTotalMissedCounts(payment) {
      let totalCount = 0;
      totalCount += payment.total_open_balance_amount || 0;
      totalCount +=
        payment.total_missed_payment_amount || payment.total_missed_amount || 0;
      totalCount += payment.total_grace_period_amount || 0;

      return totalCount;
    }
  }
}