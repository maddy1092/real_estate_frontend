import { PluginService } from ".";

const configurationService = PluginService("/payment");

export default {
  generatePayments() {
    return configurationService({
      method: "GET",
      url: "/generate/"
    });
  },
  releaseManualLock() {
    return configurationService({
      method: "GET",
      url: "/lock-releaser/"
    });
  },
  generateOpenBalanceInvoices(payload) {
    return configurationService({
      method: "POST",
      url: "/open-balance-missing/",
      payload
    });
  }
};
