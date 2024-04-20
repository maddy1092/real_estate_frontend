import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: "en", // set initial locale
  fallbackLocale: "en",
  messages: {} // set locale messages
});
