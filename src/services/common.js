import axios from "axios";
import Vue from "vue";

const authInterceptor = [
  config => {
    const language = localStorage.getItem("language");
    if (Vue.prototype.$token()) {
      config.headers["Accept-language"] = language || "en";
      config.headers.Authorization = `Bearer ${Vue.prototype.$token()}`;
    }
    return config;
  },
  error => Promise.reject(error)
];

export const authorizedReq = axios.create({});
authorizedReq.interceptors.request.use(...authInterceptor);

const getUrl = (merchant, url) =>
  `https://${merchant}/b/api/v1/plugins/real_estate${url}`;

const getMerchantUrl = (merchant, url) =>
  `https://${merchant}/b/api/v1/communication/send-event${url}`;

export const fetchPlugins = () =>
  authorizedReq({
    method: "GET",
    url: getUrl(Vue.prototype.$merchant, `/config/`)
  });

export const fetchPluginFields = () =>
  authorizedReq({
    method: "OPTIONS",
    url: getUrl(Vue.prototype.$merchant, `/config/`)
  });

export const updatePlugin = (id, data) =>
  authorizedReq({
    method: "PUT",
    url: getUrl(Vue.prototype.$merchant, `/config/${id}/`),
    data
  });

export const getPaymentOptions = () => {
  return authorizedReq({
    method: "OPTIONS",
    url: getUrl(Vue.prototype.$merchant, "/pymt/crt/")
  });
};

export const getPaymentReminder = payment_id => {
  return authorizedReq({
    method: "GET",
    url: getMerchantUrl(Vue.prototype.$merchant,`/${payment_id}/all`)
  });
};
