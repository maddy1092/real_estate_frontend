<template>
  <v-card>
    <v-card-title>
      <h3>{{ $t("Plugin Configuration") }}</h3>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="day_of_month_generate"
          v-validate="
            `required|numeric|between:${(parseInt(day_of_month_suspend) || 0) +
              1},31,31`
          "
          required
          class="mb-2"
          data-vv-name="genarate_payment_links"
          :label="$t('Day of the month to generate payment links')"
          :error-messages="errors.collect('genarate_payment_links')"
        />

        <v-text-field
          v-model="day_of_month_suspend"
          v-validate="'required|numeric|min_value:1|max_value:31'"
          required
          class="mb-2"
          data-vv-name="suspend_payment_links"
          :label="$t('Day of the month to suspend accessing payment links')"
          :error-messages="errors.collect('suspend_payment_links')"
        />

        <v-text-field
          v-model="number_of_days_of_stopping"
          v-validate="`between:0,${parseInt(day_of_month_suspend)}`"
          data-vv-name="number_of_days_of_stopping"
          class="mb-2"
          :label="
            $t(
              'Number of days of stopping the generation worker before the expiration day'
            )
          "
          :error-messages="errors.collect('number_of_days_of_stopping')"
        />

        <v-select
          v-model="activation_month"
          clearable
          v-validate="`${is_activated ? 'required' : ''}`"
          data-vv-name="activation_month"
          :disabled="disableActivation"
          :label="$t('Activation Month')"
          :items="months"
          :error-messages="errors.collect('activation_month')"
        />

        <v-select
          v-model="activation_year"
          v-validate="`${is_activated ? 'required' : ''}`"
          data-vv-name="activation_year"
          clearable
          :disabled="disableActivation"
          :items="getYears()"
          :label="$t('Activation Year')"
          :error-messages="errors.collect('activation_year')"
        />

        <v-layout class="align-center mb-3 ml-3">
          <span class="re-upload__span">{{ $t("Upload Logo") }}</span>
          <input
            type="file"
            id="myUpload"
            style="display: none"
            ref="uploadVoucher"
            accept="image/*"
            @change="event => uploadImage(event, 'receipt_logo')"
          />
          <v-btn
            @click="$refs.uploadVoucher.click()"
            class="re-custom-file-input re-ml-55"
          >
            {{ $t("Upload") }}</v-btn
          >
          <span v-if="receipt_logo">
            {{ getImageName(receipt_logo) }}
          </span>
        </v-layout>

        <v-layout class="align-center mb-3 ml-3">
          <span class="re-upload__span">{{ $t("Upload Signature") }}</span>
          <input
            type="file"
            id="myUpload"
            style="display: none"
            ref="uploadsignature"
            accept="image/*"
            @change="event => uploadImage(event, 'receipt_signature')"
          />
          <v-btn
            @click="$refs.uploadsignature.click()"
            class="re-custom-file-input re-ml-55"
          >
            {{ $t("Upload") }}</v-btn
          >
          <span v-if="receipt_signature">
            {{ getImageName(receipt_signature) }}
          </span>
        </v-layout>

        <v-checkbox
          v-model="is_activated"
          :label="$t('Is Activated')"
          :disabled="disableActivation"
        />
        <v-checkbox
          v-model="is_manual_payment_generate"
          :label="$t('Manual generating payment records')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";

import { getMonthLabels } from "../../lib/date_time";

export default {
  name: "plugin-configuration",
  emits: ["input"],
  props: {
    value: Object,
    disableActivation: Boolean
  },
  inject: ["parentValidator"],
  created() {
    this.$validator = this.parentValidator;
  },
  data() {
    return {
      months: getMonthLabels(),
      isUploadingFile: false
    };
  },
  methods: {
    upload() {
      this.$refs.myUpload.click();
    },
    getImageName(imageUrl) {
      if (imageUrl) {
        let url = new URL(imageUrl);

        // eslint-disable-next-line no-useless-escape
        url = url.pathname.replace(/^.*(\\|\/|\:)/, "");
        return url;
      }

      return "";
    },
    uploadImage(e, name) {
      this.$emit("uploadImage", { e, name });
    },
    getYears() {
      const min = new Date().getFullYear();
      const max = min + 20;
      const years = [];

      for (let i = min; i <= max; i++) {
        years.push(i);
      }
      return years;
    }
  },
  computed: {
    day_of_month_suspend: {
      get() {
        return this.value.day_of_month_suspend;
      },
      set(val) {
        this.$emit("input", { ...this.value, day_of_month_suspend: val });
      }
    },
    day_of_month_generate: {
      get() {
        return this.value.day_of_month_generate;
      },
      set(val) {
        this.$emit("input", { ...this.value, day_of_month_generate: val });
      }
    },
    is_manual_payment_generate: {
      get() {
        return this.value.is_manual_payment_generate;
      },
      set(val) {
        this.$emit("input", { ...this.value, is_manual_payment_generate: val });
      }
    },
    number_of_days_of_stopping: {
      get() {
        return this.value.number_of_days_of_stopping;
      },
      set(val) {
        this.$emit("input", { ...this.value, number_of_days_of_stopping: val });
      }
    },
    activation_month: {
      get() {
        return (
          this.value.activation_month &&
          moment()
            .month(parseInt(this.value.activation_month) - 1)
            .format("MMM")
        );
      },
      async set(val) {
        await this.$nextTick();
        this.$emit("input", {
          ...this.value,
          activation_month: val
            ? parseInt(
                moment()
                  .month(val)
                  .format("M")
              )
            : null
        });
        await this.$nextTick();
      }
    },
    activation_year: {
      get() {
        return this.value.activation_year;
      },
      async set(val) {
        this.$emit("input", { ...this.value, activation_year: val || null });
      }
    },
    receipt_logo: {
      get() {
        return this.value.receipt_logo || null;
      },
      async set(val) {
        this.$emit("input", { ...this.value, receipt_logo: val || null });
      }
    },
    receipt_signature: {
      get() {
        return this.value.receipt_signature || null;
      },
      async set(val) {
        this.$emit("input", { ...this.value, receipt_signature: val || null });
      }
    },
    is_activated: {
      get() {
        return this.value.is_activated;
      },
      set(val) {
        this.$emit("input", { ...this.value, is_activated: val });
      }
    }
  }
};
</script>
