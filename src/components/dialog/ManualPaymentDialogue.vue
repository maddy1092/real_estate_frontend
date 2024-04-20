<template>
  <v-dialog v-model="dialog" width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-space-between form-title"
        primary-title
      >
        <span class="text-start">{{ $t("Manual Payment") }}</span>
        <v-icon class="d-flex justify-end" @click="dialog = false">
          close
        </v-icon>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.id
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
            <v-list-tile-content>{{
              formatDates(selectedPayment.modified, true)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.initiator
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Status") }}</v-list-tile-content>
            <v-list-tile-content :class="{ ongoing: true }">
              {{ selectedPayment.status }}
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.property_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.unit_number
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.unittype
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.tenant_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Month") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.payment_month
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Year") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.payment_year
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Amount") }}</v-list-tile-content>
            <v-list-tile-content
              >{{ selectedPayment.amount }} {{ $t("KD") }}</v-list-tile-content
            >
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { capitalizeFirstLetter, defaultFormat } from "../../helper";

export default {
  name: "edit-price-dialog",
  emit: ["closeDialog"],
  props: {
    showDialog: Boolean,
    selectedPayment: Object,
    label: {
      type: String,
      default: "Label"
    }
  },
  data() {
    return {
      dialog: this.showDialog,
      contract: {
        tenant: {},
        unit: {},
        property: {}
      }
    };
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$emit("closeDialog");
      }
    },
    showDialog(value) {
      this.dialog = value;
    },
    selectedContract() {
      this.contract = this.selectedContract;
    }
  },
  methods: {
    formatDates(value, addTime) {
      return defaultFormat(value, addTime);
    },
    capitalize(value) {
      return capitalizeFirstLetter(value);
    }
  }
};
</script>

<style scoped>
.headline {
  padding: 0px 25px !important;
  padding-top: 15px !important;
}
.v-list__tile__content {
  flex: 1 1 50% !important;
}
</style>
