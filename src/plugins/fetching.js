import Vue from "vue";

import { i18n } from "./i18n";

const codeMessagesMap = {
  200: "Applied successfully",
  201: "Created successfully"
};

const Fetching = {
  install(Vue) {
    // show snackbar after success/failed requests
    Vue.prototype.$processReq = function(
      promise,
      notify_on_ok = true,
      notify_on_err = true
    ) {
      this.processing = true;
      return promise
        .then(res => {
          if (notify_on_ok) {
            let message = this.$t(codeMessagesMap[200]);
            if (res.data.message) {
              message = res.data.message;
            } else if (codeMessagesMap[res.status]) {
              message = this.$t(codeMessagesMap[res.status]);
            }

            this.$root.$emit("snackbar", {
              text: message,
              color: "success"
            });
          }
          return res;
        })
        .catch(this.$processReqError)
        .catch(err => {
          if (err.response && err.response.code === 423) {
            this.is_locked = true;
            this.is_locked_message =
              err.response.data && err.response.data.message;
          }
          if (notify_on_err) {
            let text = err.message;
            let multiline = false;
            if (err.response && err.response.data.message) {
              text = err.response.data.message;
            } else {
              if (err.response) {
                if (err.response.status === 500) {
                  text = i18n.tc("Something went wrong while fetching results");
                } else if (
                  err.response &&
                  err.response.data &&
                  err.response.data["errors"]
                ) {
                  err.response.data["errors"].forEach(obj => {
                    if (obj.field_error) {
                      text = `${obj.field}:: ${obj.field_error}`;
                      if (obj.field_error.length > 100) {
                        multiline = true;
                      }
                      return;
                    }
                  });
                } else if (
                  err.response &&
                  err.response.data &&
                  err.response.data.length
                ) {
                  if (err.response.data[0]) {
                    text = err.response.data[0];
                  }
                } else if (
                  err.response &&
                  err.response.data &&
                  Object.values(err.response.data).length
                ) {
                  if (Object.values(err.response.data)[0]) {
                    text = Object.values(err.response.data)[0][0];
                  }
                }
              } else {
                text = err;
              }
            }
            this.$root.$emit("snackbar", { text, color: "error", multiline });
          }
          throw err;
        })
        .finally(() => {
          this.processing = false;
        });
    };
    Vue.prototype.$processReqSilent = function(promise) {
      this.processing = true;
      return promise.catch(this.$processReqError).finally((...args) => {
        this.processing = false;
        return args;
      });
    };
    Vue.prototype.$processReqError = function(err) {
      if (err.response && err.response.status === 401) {
        Vue.prototype.$logout();
      }
      throw err;
    };
    Vue.mixin({
      data: () => ({
        processing: false,
        is_locked: false,
        is_locked_message: ""
      })
    });
  }
};

Vue.use(Fetching);
