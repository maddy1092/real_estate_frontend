<template>
  <div class="configuration">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Properties") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end">← {{ $t("Back") }}</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="flex-wrap" xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg9>
          <plugin-configuration
            v-if="!isLoading"
            v-model="config"
            :errors="errors"
            :disableActivation="disableActivation"
            @uploadImage="value => uploadImage(value.e, value.name)"
          />
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'300px'"
            :width="'100%'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout v-show="!isLoading" row wrap justify-center class="re-margin-t40">
      <v-flex xs12 lg9 class="re-custom-position">
        <v-expansion-panel expand v-model="panel" class="content__panel">
          <v-expansion-panel-content>
            <template v-slot:header>
              <v-btn dark class="re-orangtbtn show-btn">
                {{
                  panel.length && panel[0] === false ? $t("SHOW") : $t("HIDE")
                }}
              </v-btn>
            </template>
            <v-tabs
              v-model="active"
              color="transparent"
              dark
              slider-color="#f57829"
              :class="{ theight: !panel[0] }"
            >
              <v-tab ripple>
                <h3>{{ $t("Advanced Settings") }}</h3>
              </v-tab>
              <v-tab-item>
                <v-card class="re-margin-t40">
                  <v-card-title class="re-custom-controls">
                    <h3>{{ $t("Advanced Settings") }}</h3>
                  </v-card-title>
                  <advance-setting v-model="config" :errors="errors" />
                </v-card>
              </v-tab-item>
              <v-tab ripple>
                <h3>{{ $t("Terms & Conditions") }}</h3>
              </v-tab>
              <v-tab-item>
                <v-card class="re-margin-t40">
                  <v-card-title class="re-custom-controls">
                    <h3>{{ $t("Terms & Conditions") }}</h3>
                  </v-card-title>
                  <terms-condition v-model="config" />
                </v-card>
              </v-tab-item>
              <v-tab ripple>
                <h3>{{ $t("Fields") }}</h3>
              </v-tab>
              <v-tab-item>
                <v-card class="re-margin-t40">
                  <v-card-title class="re-custom-controls">
                    <h3>{{ $t("Fields") }}</h3>
                    <v-btn class="re-add-field" @click="addNew">{{
                      $t("Add new field")
                    }}</v-btn>
                  </v-card-title>
                  <span v-for="(field, index) of config.fields" :key="index">
                    <fields
                      :errors="errors"
                      :options="
                        options.fields ? options.fields.child.children : {}
                      "
                      :value="field"
                      :index="index"
                      @onUpdate="updateFields($event, index)"
                      @onDelete="removeFromFields(index)"
                    />
                  </span>
                </v-card>
              </v-tab-item>

              <v-tab ripple>
                <h3>{{ $t("Worker") }}</h3>
              </v-tab>
              <v-tab-item>
                <v-card class="re-margin-t40">
                  <v-card-title class="re-custom-controls">
                    <h3>{{ $t("Worker") }}</h3>
                  </v-card-title>
                  <worker />
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <div class="text-xs-center mt-4">
      <v-btn
        v-if="!isLoading"
        dark
        :disabled="isUploadingFile"
        class="re-orangtbtn"
        @click="saveForm"
      >
        {{ $t("Save") }}
      </v-btn>
      <v-btn v-if="!isLoading" dark>{{ $t("Cancel") }} </v-btn>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import AdvanceSetting from "../components/Configuration/AdvanceSetting.vue";
import Fields from "../components/Configuration/Fields.vue";
import PluginConfiguration from "../components/Configuration/PluginConfiguration.vue";
import TermsCondition from "../components/Configuration/TermsCondition.vue";
import Worker from "../components/Configuration/Worker.vue";
import {
  fetchPluginFields,
  fetchPlugins,
  updatePlugin
} from "../services/common";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "Configuration",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  components: {
    Fields,
    TermsCondition,
    AdvanceSetting,
    PluginConfiguration,
    Worker
  },
  data() {
    return {
      disableActivation: false,
      config: {},
      active: 0,
      panel: [false],
      options: {},
      items: [],
      isLoading: false,
      isUploadingFile: false
    };
  },
  async created() {
    this.$validator.localize("en", this.dictionary);
    await this.fetchConfiguration();
    await this.fetchFields();
  },
  provide() {
    return {
      parentValidator: this.$validator
    };
  },
  watch: {
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  computed: {
    dictionary() {
      return {
        custom: {
          default_email: {
            email: () => this.$t("Default email is not valid")
          },
          day_of_month_generate: {
            between: () =>
              this.$t(
                "Day of the month to generate links must be greater than day of the month to suspend payment links"
              )
          },
          activation_year: {
            required: () => this.$t("Activation year is required"),
            numeric: () => this.$t("Activation year is not valid")
          },
          activation_month: {
            required: () => this.$t("Activation month is required"),
            numeric: () => this.$t("Activation month is not valid")
          },
          genarate_payment_links: {
            required: () =>
              this.$t(
                "The Day of month to genarate payment links field is required"
              ),
            between: (data, val) =>
              this.$t(
                `The Day of month to genarate payment links must be between`,
                {
                  minValue: val[0],
                  maxValue: val[1]
                }
              )
          },
          suspend_payment_links: {
            required: () =>
              this.$t(
                "The Day of the month to suspend accessing payment links field is required"
              ),
            max_value: () =>
              this.$t(
                "The Day of the month to suspend accessing payment links must be 31 or less"
              )
          }
        }
      };
    }
  },
  methods: {
    async saveForm() {
      try {
        this.isLoading = true;
        if (await this.$validator.validateAll()) {
          this.config["receipt_logo"] = undefined;
          this.config["receipt_signature"] = undefined;
          this.config["additional_fee"] = undefined;
          this.config["fee_value"] = undefined;
          this.config["fee_type"] = undefined;
          await this.$processReq(updatePlugin(this.config.id, this.config));
          this.$router.go(-1);
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to Update Plugin - ", err);
      }
    },
    async uploadImage(e, name) {
      try {
        this.isUploadingFile = true;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append(`${name}`, file);

        const response = await this.$processReq(
          updatePlugin(this.config.id, formData)
        );
        this.$root.$emit("snackbar", {
          text: this.$t("File Uploaded Successfully"),
          color: "success"
        });
        this.config[name] = response.data[name];
        this.isUploadingFile = false;
      } catch (err) {
        this.isUploadingFile = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while uploading file"),
          color: "error"
        });
        console.log("Error: Unable to Upload image - ", err);
      }
    },
    addNew() {
      if (Array.isArray(this.config.fields) && this.config.fields.length) {
        this.config.fields.push({});
      } else {
        this.config = {
          ...this.config,
          fields: [{}]
        };
      }
    },
    removeFromFields(index) {
      this.$delete(this.config.fields, index);
    },
    updateFields(val, index) {
      Vue.set(this.config.fields, index, val);
    },
    async fetchConfiguration() {
      try {
        this.isLoading = true;
        const resp = await this.$processReq(fetchPlugins(), false);
        this.config = resp.data || {};
        this.disableActivation = this.config.is_activated;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to Fetch Configuration - ", err);
      }
    },
    async fetchFields() {
      try {
        const resp = await this.$processReq(fetchPluginFields(), false);
        this.options = resp.data.actions.PUT || {};
      } catch (err) {
        console.log("Error: Unable to Fetch plugin fields - ", err);
      }
    }
  }
};
</script>

<style scoped>
.re-custom-position {
  position: relative;
}
.hide-tabs-btns {
  position: absolute;
  top: 0px;
  right: 0px;
}
.show-btn {
  position: absolute !important;
  right: 0 !important;
}
.content__panel >>> .v-expansion-panel__header:after {
  content: unset;
}
.content__panel >>> .v-expansion-panel__header--active:after {
  content: unset;
}
.v-expansion-panel__body .v-card {
  background-color: #fff !important;
}
.change-position {
  position: absolute;
  right: 0;
}
.theme--light.v-expansion-panel .v-expansion-panel__container {
  background-color: transparent !important;
}
</style>
