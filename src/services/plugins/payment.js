import { PluginService } from ".";

const advPayment = PluginService("/advpay");
const paymentService = PluginService("/payment");

export default {
  fetchAdvPayment(params) {
    return advPayment({
      method: "GET",
      url: "/",
      params
    });
  },
  getPaymentList(params) {
    return paymentService({
      method: "GET",
      url: "/",
      params
    });
  },
  getPaymentDetails(id) {
    return paymentService({
      method: "GET",
      url: `/${id}`
    });
  },
  addNewPayment(data) {
    return paymentService({
      method: "POST",
      url: "/",
      data
    });
  },
  updatePayment(data, id) {
    return paymentService({
      method: "PUT",
      url: `/${id}/`,
      data
    });
  },
  checkPayment(params) {
    return paymentService({
      method: "GET",
      url: "/check/",
      params
    });
  },
  notifyPayments(params) {
    return paymentService({
      method: "GET",
      url: "/notify/",
      params
    });
  }
};
