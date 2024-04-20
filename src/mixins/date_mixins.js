import moment from "moment";

export default {
  methods: {
    allowFirstDay(val) {
      return parseInt(val.split("-")[2], 10) === 1;
    },
    allowLastDay(val) {
      return (
        parseInt(
          moment(val)
            .clone()
            .add(1, "day")
            .format("DD")
        ) === 1
      );
    },
    dateExistBetween(val, date) {
      if (!date) {
        return true;
      }

      const startDate = moment(date).subtract(1, "day");
      const endDate = moment(date)
        .clone()
        .add(moment(date).daysInMonth(), "day");

      return moment(val).isBetween(startDate, endDate);
    }
  }
};
