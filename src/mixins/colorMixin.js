export default {
  methods: {
    getRowColor(item, expand, prevItem, isRenew, isRentPage) {
      console.log(item.is_generated);
      const expandClass = expand ? "active-class" : "";
      const previousItem = prevItem ? prevItem : {};
      if (!isRenew && item.is_grace_period) {
        return `higlight-text-is-grace ${expandClass}`;
      }
      if (item.is_missed) {
        return `highlight-text-is-missed ${expandClass}`;
      }
      if (item.is_open_balance) {
        return `highlight-text-open-balance ${expandClass}`;
      }
      if (
        (!item.is_generated &&
          !isRentPage &&
          !isRenew &&
          prevItem &&
          !previousItem.is_paid) ||
        (!item.is_generated && !isRenew && !isRentPage && item.is_suspended)
      ) {
        return `highlight-text-is-suspended ${expandClass}`;
      }

      return `default-color ${expandClass}`;
    },

    getReportRowColor(item, expand, last_paid) {
      const expandClass = expand ? "active-class" : "";
      if (item.is_grace_period) {
        return `higlight-text-is-grace ${expandClass}`;
      }
      if (item.is_missed) {
        return `highlight-text-is-missed ${expandClass}`;
      }
      if (item.is_open_balance) {
        return `highlight-text-open-balance ${expandClass}`;
      }
      if (!last_paid || item.is_suspended) {
        return `highlight-text-is-suspended ${expandClass}`;
      }

      return `default-color ${expandClass}`;
    }
  }
};
