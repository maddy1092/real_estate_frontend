<template>
  <v-card-text>
    <v-text-field
      v-model="default_email"
      v-validate="'email'"
      :label="this.$t('Default email')"
      data-vv-name="default_email"
      :error-messages="errors.collect('default_email')"
    />

    <v-checkbox
      v-model="email_payment_details"
      :label="$t('Hide email')"
      class="re-gray-color"
      color="grey darken-1"
    />

    <v-checkbox
      v-model="email_reminder"
      :label="$t('Email Reminder')"
      class="re-gray-color"
      color="grey darken-1"
    />

    <v-checkbox
      v-model="sms_reminder"
      :label="$t('Sms Reminder')"
      class="re-gray-color"
      color="grey darken-1"
    />

    <v-checkbox
      v-model="individual_proxy"
      :label="$t('Individual proxy fields')"
      class="re-gray-color"
      color="grey darken-1"
    />
  </v-card-text>
</template>

<script>
export default {
  name: "advance-setting",
  emits: ["input"],
  inject: ["parentValidator"],
  props: {
    value: Object
  },
  created() {
    this.$validator = this.parentValidator;
  },
  computed: {
    default_email: {
      get() {
        return this.value.default_email;
      },
      set(val) {
        this.$emit("input", { ...this.value, default_email: val });
      }
    },
    email_payment_details: {
      get() {
        return this.value.email_payment_details;
      },
      set(val) {
        this.$emit("input", { ...this.value, email_payment_details: val });
      }
    },
    email_reminder: {
      get() {
        return this.value.email_reminder;
      },
      set(val) {
        this.$emit("input", { ...this.value, email_reminder: val });
      }
    },
    sms_reminder: {
      get() {
        return this.value.sms_reminder;
      },
      set(val) {
        this.$emit("input", { ...this.value, sms_reminder: val });
      }
    },
    individual_proxy: {
      get() {
        return this.value.individual_proxy;
      },
      set(val) {
        this.$emit("input", { ...this.value, individual_proxy: val });
      }
    }
  }
};
</script>
