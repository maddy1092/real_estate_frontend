import axios from "axios";
import Vue from "vue";

import { i18n } from "../plugins/i18n";

export const BASE_API_URL = process.env.VUE_APP_API_GATEWAY_URL + "/api/v1";

export const authInterceptor = [
  config => {
    if (Vue.prototype.$token()) {
      config.headers["Accept-language"] = i18n.locale;
      config.headers.Authorization = `Bearer ${Vue.prototype.$token()}`;
      config.headers["x-merchant"] = Vue.prototype.$merchant;
    }
    return config;
  },
  error => Promise.reject(error)
];

export const Service = url =>
  axios.create({
    baseURL: BASE_API_URL + url
  });

export const AuthorizedService = url => {
  const authorizedService = Service(url);
  authorizedService.interceptors.request.use(...authInterceptor);
  return authorizedService;
};
