<template>
  <v-card-text>
    <v-btn
      class="generate-btn"
      @click="generatePayments"
      :loading="generatingPayment"
    >
      {{ $t("Generate Payments") }}
    </v-btn>

    <v-btn
      class="generate-btn lock-btn"
      @click="releaseManualLock"
      :loading="releasingLock"
    >
      {{ $t("Release Manually Generating Lock") }}
    </v-btn>
    <v-btn
      class="generate-btn invoice-btn"
      :loading="generatingInvoices"
      @click="generateOpenBalanceInvoices"
      >{{ $t("Generate Open Balance Invoices") }}</v-btn
    >
  </v-card-text>
</template>

<script>
import configurationService from "@/services/plugins/worker";
export default {
  name: "worker",
  data() {
    return {
      generatingPayment: false,
      releasingLock: false,
      generatingInvoices: false
    };
  },
  methods: {
    async generateOpenBalanceInvoices() {
      try {
        this.generatingInvoices = true;
        const payload = {};
        await this.$processReq(
          configurationService.generateOpenBalanceInvoices(payload),
          false
        );
        this.generatingInvoices = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Open balance and missing payments are being created"),
          color: "success"
        });
      } catch (err) {
        this.generatingInvoices = false;
        console.log("Error: Unable to generate Open Balance Invoices - ", err);
      }
    },
    async generatePayments() {
      try {
        this.generatingPayment = true;
        await this.$processReq(configurationService.generatePayments(), false);
        this.generatingPayment = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Payments are being generated"),
          color: "success"
        });
      } catch (err) {
        this.generatingPayment = false;
        console.log("Error: Unable to generate Payments - ", err);
      }
    },
    async releaseManualLock() {
      try {
        this.releasingLock = true;
        await this.$processReq(configurationService.releaseManualLock(), false);
        this.releasingLock = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Lock releaser process started."),
          color: "success"
        });
      } catch (err) {
        this.releasingLock = false;
        console.log("Error: Unable to release lock - ", err);
      }
    }
  }
};
</script>
<style>
.generate-btn {
  height: 36px !important;
  width: 12rem !important;
  font-size: 14px !important;
  color: #fff !important;
  background: #f57829 !important;
  text-transform: none !important;
  box-shadow: 2px 4px 4px 0px #00000040 !important;
  margin-inline-start: 0px !important;
  margin-top: 30px !important;
  margin-bottom: 30px !important;
}
.lock-btn {
  width: 18rem !important;
}
.invoice-btn {
  width: 16rem !important;
}
</style>
