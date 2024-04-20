import Vue from "vue";
import Vuex from "vuex";

import contract from "./modules/contract";
import properties from "./modules/properties";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    property: properties,
    contract
  },
  strict: debug,
  plugins: []
});
