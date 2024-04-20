<template>
  <v-dialog v-model="dialog" width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-space-between form-title"
        primary-title
      >
        <span class="text-start">{{ label }}</span>
        <v-icon class="d-flex justify-end" @click="$emit('closeDialog')">
          close
        </v-icon>
      </v-card-title>
      <v-card-text v-if="contract.id">
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              contract.id
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
            <v-list-tile-content>{{
              formatDates(contract.modified, true)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              contract.initiator
            }}</v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              contract.tenant_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
            <v-list-tile-content>{{
              contract.property_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
            <v-list-tile-content>{{ contract.unittype }}</v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>{{
              $t("Original Amount")
            }}</v-list-tile-content>
            <v-list-tile-content
              >{{ parseInt(contract.original_amount).toFixed(3) }} {{ $t("KD") }}</v-list-tile-content
            >
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Before Modified Amount")
            }}</v-list-tile-content>
            <v-list-tile-content v-if="contract.amount"
              >{{ parseInt(contract.amount).toFixed(3) }} {{ $t("KD") }}</v-list-tile-content
            >
            <v-list-tile-content v-if="!contract.amount">-</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("After Modified Amount")
            }}</v-list-tile-content>
            <v-list-tile-content v-if="contract.new_amount"
              >{{ contract.new_amount }} {{ $t("KD") }}</v-list-tile-content
            >
            <v-list-tile-content v-if="!contract.new_amount"
              >-</v-list-tile-content
            >
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defaultFormat } from "../../helper";

export default {
  name: "contract-dialog",
  props: {
    showDialog: Boolean,
    selectedContract: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      default: "Label",
    },
  },
  data() {
    return {
      dialog: this.showDialog,
      contract: {
        tenant: {},
        unit: {},
        property: {},
      },
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
    },
  },
  methods: {
    formatDates(value, containsTime) {
      return defaultFormat(value, containsTime);
    },
  },
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
