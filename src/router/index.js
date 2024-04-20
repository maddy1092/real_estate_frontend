import Vue from "vue";
import VueRouter from "vue-router";

import { i18n } from "../plugins/i18n";
import NotFound from "../views/NotFound.vue";

import realEstate from "./real_estate";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:lang",
    component: { template: "<router-view />" },
    children: [
      realEstate,
      {
        path: "*",
        name: "404",
        component: NotFound
      }
    ]
  }
];
/* eslint-disable */
const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  // i18n logic ::::::::::::::::::::::::::::::::::::::::::::
  const lang = to.params.lang;
  if (i18n.locale !== lang) {
      i18n.locale = lang
  }
  return next();
});

export default router;
