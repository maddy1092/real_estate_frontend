import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import singleSpaVue from "single-spa-vue";
import VueSkeletonLoader from "skeleton-loader-vue";
import Vue from "vue";
import VuePhoneNumberInput from "vue-phone-number-input";

import pjson from "../package.json";

import App from "./App.vue";
import { i18n } from "./plugins/i18n";
import "./plugins/vee-validate";
import "./plugins/fetching";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import router from "./router";
import store from "./store";

Vue.component("vue-skeleton-loader", VueSkeletonLoader);
Vue.component("vue-phone-number-input", VuePhoneNumberInput);

Vue.config.productionTip = false;

Sentry.setTag("microfrontend", "real_estate");
Sentry.init({
  dsn:
    process.env.VUE_APP_SENTRY_URL ||
    "sentry.ottu.net",
  integrations: [
    new Integrations.Vue({ Vue, attachProps: true, logErrors: true })
  ],
  release: `real_estate@${pjson.version}`,
  tracesSampleRate: process.env.VUE_APP_SENTRY_SAMPLE_RATE || 0.2,
  ignoreErrors: Vue.prototype.$ignoredSentryErrors,
  beforeSend: Vue.prototype.$checkSentryErrors
});

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render(h) {
      return h(App, {});
    },
    created: function() {
      Vue.prototype.$token = this.idToken;
      Vue.prototype.$merchant = this.merchant;
      Vue.prototype.$logout = this.logout;
      Vue.prototype.$gatewayApiKey = this.gatewayApiKey;
      Vue.prototype.$ignoredSentryErrors = this.ignoredSentryErrors;
      Vue.prototype.$checkSentryErrors = this.checkSentryErrors;

      const lang = this.$route.path.slice(1, 3);
      if (lang === "en" || lang === "ar") {
        this.$i18n.locale = lang;
      }
      this.setLang();
      this.$vuetify.rtl = this.$i18n.locale === "ar";
    },
    watch: {
      "$i18n.locale": function() {
        this.$vuetify.rtl = this.$i18n.locale === "ar";
      }
    },
    methods: {
      setLang() {
        const translations = this.translations();
        this.$i18n.setLocaleMessage("en", translations.en);
        this.$i18n.setLocaleMessage("ar", translations.ar);
      }
    },
    router,
    i18n,
    store
  }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
