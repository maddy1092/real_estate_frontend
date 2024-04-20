import { PluginService } from "./index";

const invoiceServices = PluginService("");

export default {
  fetchGeneratedPaymentsList(params) {
    return invoiceServices({
      method: "GET",
      url: "/payment/generated-payments/",
      params
    });
  },
  fetchNotGeneratedPaymentsList(params) {
    return invoiceServices({
      method: "GET",
      url: "/payment/not-generated-payments/",
      params
    });
  },
  fetchSelectedInvoices(params, id) {
    return invoiceServices({
      method: "GET",
      url: `/payment/contract/${id}`,
      params
    });
  },
  updateInvoices(data) {
    return invoiceServices({
      method: "PATCH",
      url: "payment/open-balance-missing/update/",
      data
    });
  },
  createPayments(data) {
    return invoiceServices({
      method: "POST",
      url: "/payment/not-generated-payments/",
      data
    });
  },
  fetchInvoices(params) {
    return invoiceServices({
      method: "GET",
      url: "/payment/open-balance-missing/contract/",
      params
    });
  },
  updateNewContractInvoices(data, id, contract_enum) {
    return invoiceServices({
      method: "POST",
      url: `/payment/open-balance-missing/contract/${id}/${contract_enum}/`,
      data
    });
  }
};
