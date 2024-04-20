<template>
  <v-dialog v-model="dialog" width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-space-between form-title"
        primary-title
      >
        <span class="text-start">{{ $t("Edit Price") }}</span>
        <v-icon class="d-flex justify-end" @click="dialog = false">
          close
        </v-icon>
      </v-card-title>

      <v-card-text>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile orange-c">{{
              selectedUnit.id
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              formatDates(selectedUnit.modified)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile orange-c">{{
              selectedUnit.initiator
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Status") }}</v-list-tile-content>
            <v-list-tile-content
              class="align-left-tile ongoing"
              :class="{ expired: selectedUnit.status === 'vacant' }"
              >{{ selectedUnit.status }}</v-list-tile-content
            >
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.property_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.unit_number
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.unittype
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Current Unit Amount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.old_price
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Current Unit Discount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.old_discount
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Current Percentage / Fixed")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              capitalize(selectedUnit.old_discount_type)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Current Unit Net Amount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.old_invoice_amount
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("New Unit Amount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.price
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("New Unit Discount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.discount
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("New Percentage / Fixed")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              capitalize(selectedUnit.discount_type)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("New Unit Net Amount")
            }}</v-list-tile-content>
            <v-list-tile-content class="align-left-tile">{{
              selectedUnit.invoice_amount
            }}</v-list-tile-content>
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
    selectedUnit: {
      type: Object,
      default: () => {}
    },
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
    formatDates(value) {
      return defaultFormat(value, true);
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
.align-left-tile {
  flex: 1 1 40% !important;
}
</style>
