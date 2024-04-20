import Vue from "vue";

import { PluginService } from ".";

const logs = PluginService("");

export default {
  fetchContractList(contract_enum, params) {
    return logs({
      method: "GET",
      url: `/contract/logs/${contract_enum}/`,
      params
    });
  },
  fetchUnitLogs(contract_enum, params) {
    return logs({
      method: "GET",
      url: `/unit/logs/${contract_enum}/`,
      params
    });
  },
  fetchPaymentList(contract_enum, params) {
    return logs({
      method: "GET",
      url: `/payment/logs/${contract_enum}/`,
      params
    });
  },
  contractRollback(contarct_id) {
    return logs({
      method: "DELETE",
      headers: {
        "X-API-KEY": Vue.prototype.$gatewayApiKey
      },
      url: `/contract/${contarct_id}/`
    });
  },
  terminateContractRollback(contarct_id) {
    return logs({
      method: "DELETE",
      url: `/contract/${contarct_id}/termination-rollback/`
    });
  },
  manualPaymentRollback(payment_id) {
    return logs({
      method: "DELETE",
      headers: {
        "X-API-KEY": Vue.prototype.$gatewayApiKey
      },
      url: `/payment/${payment_id}/rollback-manual-payment/`
    });
  }
};
